import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { SignUpDTO, signUpSchema } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO, signInSchema } from './dto/signin.dto';
import { SignInSwagger, SignUpSwagger } from 'src/common/decorators/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @SignUpSwagger()
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Post('sign-in')
  @SignInSwagger()
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO);
  }
}
