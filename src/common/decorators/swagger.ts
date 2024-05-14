import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { ZodIssue } from 'zod';

class SignUpDTO {
  @ApiProperty({ required: true })
  firstName: string;

  @ApiProperty({ required: true })
  lastName: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true, minLength: 6, maxLength: 20 })
  password: string;
}

class SignInDTO {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true, minLength: 6, maxLength: 20 })
  password: string;
}

class SignUpSuccess {
  @ApiProperty()
  isSuccess: boolean;

  @ApiProperty()
  message: string;
}

class SignInSucces {
  @ApiProperty()
  isSuccess: boolean;

  @ApiProperty()
  accessToken: string;
}

class BadRequest {
  @ApiProperty()
  isSuccess: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  errors?: ZodIssue[];
}

class InternalServerErrorException {
  @ApiProperty()
  isSuccess: boolean;

  @ApiProperty()
  message: string;
}

export const SignUpSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create account' }),
    ApiBody({
      description: 'Request body type',
      type: SignUpDTO,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: BadRequest,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server exception',
      type: InternalServerErrorException,
    }),
    ApiCreatedResponse({
      description: 'Response type for created accounts',
      type: SignUpSuccess,
    }),
  );

export const SignInSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Sign in using email and password' }),
    ApiBody({
      description: 'Request body type',
      type: SignInDTO,
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: BadRequest,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server exception',
      type: InternalServerErrorException,
    }),
    ApiCreatedResponse({
      description: 'Response type authenticated user',
      type: SignInSucces,
    }),
  );
