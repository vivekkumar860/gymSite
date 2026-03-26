import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain-error';
import { ERROR_CODES } from '../constants/error-codes';

/**
 * Catches all exceptions and returns a consistent JSON error response.
 * Maps DomainError subclasses to their status codes.
 * Logs unexpected errors as internal server errors.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainError) {
      this.handleDomainError(response, exception);
      return;
    }

    if (exception instanceof HttpException) {
      this.handleHttpException(response, exception);
      return;
    }

    this.handleUnknownError(response, exception);
  }

  private handleDomainError(response: Response, error: DomainError): void {
    response.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
  }

  private handleHttpException(response: Response, error: HttpException): void {
    const status = error.getStatus();
    const errorResponse = error.getResponse();

    response
      .status(status)
      .json(
        typeof errorResponse === 'string'
          ? { code: ERROR_CODES.INTERNAL_ERROR, message: errorResponse }
          : errorResponse,
      );
  }

  private handleUnknownError(response: Response, error: unknown): void {
    this.logger.error(
      'Unhandled exception',
      error instanceof Error ? error.stack : error,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    });
  }
}
