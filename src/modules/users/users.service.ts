import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAccount(user: Omit<User, 'userId'>) {
    try {
      await this.userRepository.save({
        ...user,
      });

      return {
        isSuccess: true,
        message: 'Account created successfully',
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 1062) {
          throw new BadRequestException({
            isSuccess: false,
            message: 'This email is already in use',
          });
        }
      }

      this.logger.error(`Failed to create user ${user.email}`);
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Failed to create account',
      });
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: {
          userId: true,
          password: true,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by email ${email}`);
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Authentication failed',
      });
    }
  }
}
