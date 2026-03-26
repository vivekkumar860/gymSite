import { DomainError } from './domain-error';

/** Thrown when business-level validation fails (not input parsing). */
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super('VALIDATION_ERROR', message, 422);
  }
}
