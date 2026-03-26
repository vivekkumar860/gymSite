import { DomainError } from './domain-error';

/** Thrown when a resource already exists or a uniqueness constraint is violated. */
export class ConflictError extends DomainError {
  constructor(resource: string, field: string) {
    super(
      'RESOURCE_CONFLICT',
      `${resource} with this ${field} already exists`,
      409,
    );
  }
}
