import { DomainError } from './domain-error';

/** Thrown when the user lacks permission for the requested action. */
export class AuthorizationError extends DomainError {
  constructor(message = 'You do not have permission to perform this action') {
    super('AUTHORIZATION_ERROR', message, 403);
  }
}
