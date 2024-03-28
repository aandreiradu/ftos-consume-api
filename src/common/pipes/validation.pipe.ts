import {
  PipeTransform,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  async transform(value: unknown) {
    try {
      const parsedValue = await this.schema.safeParseAsync(value);
      if (parsedValue.success === false) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: parsedValue.error.errors,
        });
      }
      return parsedValue.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
