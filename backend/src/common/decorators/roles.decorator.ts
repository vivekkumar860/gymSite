import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restricts endpoint access to users with the specified roles.
 * Usage: @Roles('ADMIN') or @Roles('ADMIN', 'TRAINER')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
