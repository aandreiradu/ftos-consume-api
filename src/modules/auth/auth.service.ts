import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDTO } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO) {
    try {
      const createAccountPayload = {
        email: signUpDTO.email,
        firstName: signUpDTO.firstName,
        lastName: signUpDTO.lastName,
        password: await this.hashData(signUpDTO.password),
      };

      return this.userService.createAccount(createAccountPayload);
    } catch (error) {
      this.logger.error(`Failed to create account ${signUpDTO.email}`);
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Failed to create account',
      });
    }
  }

  async signIn(signInDTO: SignInDTO) {
    try {
      const user = await this.userService.findUserByEmail(signInDTO.email);

      if (!user) {
        throw new BadRequestException({
          isSuccess: false,
          message: 'Incorrect email or password',
        });
      }

      const passwordMatching = await this.passwordsMatch(
        signInDTO.password,
        user.password,
      );

      if (!passwordMatching) {
        throw new BadRequestException({
          isSuccess: false,
          message: 'Incorrect email or password',
        });
      }

      const accessToken = await this.generateAccessToken(user.userId);

      return {
        isSuccess: true,
        accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to authenticate user ${signInDTO.email}`);
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException({
        isSuccess: false,
        message: `Authentication failed`,
      });
    }
  }

  private hashData(input: string): Promise<string> {
    const saltRounds = +this.configService.get('SALT_ROUNDS') ?? 10;
    return bcrypt.hash(input, saltRounds);
  }

  private passwordsMatch(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  private async generateAccessToken(userId: number): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: `${this.configService.get('AUTH_AT_EXPIRE_MIN') ?? '30'}m`,
        secret: this.configService.get('AUTH_AT_SECRET'),
      },
    );

    return accessToken;
  }
}
