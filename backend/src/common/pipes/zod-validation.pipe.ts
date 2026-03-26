import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { type ZodSchema, ZodError } from 'zod';

/**
 * Validates and transforms request data using a Zod schema.
 * Usage: @Body(new ZodValidationPipe(MySchema)) dto: MyDto
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly schema: ZodSchema;

  constructor(schema: ZodSchema) {
    this.schema = schema;
  }

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (result.success) return result.data;

    throw new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      errors: this.formatErrors(result.error),
    });
  }

  private formatErrors(error: ZodError): Record<string, string> {
    const formatted: Record<string, string> = {};

    for (const issue of error.issues) {
      const path = issue.path.join('.');
      formatted[path] = issue.message;
    }

    return formatted;
  }
}
