/**
 * Base class for all domain-level errors.
 * Maps to HTTP responses via the GlobalExceptionFilter.
 */
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
