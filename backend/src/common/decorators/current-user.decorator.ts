import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** JWT payload shape attached to request by JwtStrategy. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Extracts the authenticated user's ID from the JWT payload.
 * Usage: @CurrentUser() userId: string
 * Usage: @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) return null;
    if (field) return user[field];
    return user.sub;
  },
);
