import { DomainError } from './domain-error';

/** Thrown when a requested resource does not exist. */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(
      'RESOURCE_NOT_FOUND',
      `${resource} with identifier "${identifier}" was not found`,
      404,
    );
  }
}
