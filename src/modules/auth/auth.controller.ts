import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { SignUpDTO, signUpSchema } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO, signInSchema } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO);
  }
}
