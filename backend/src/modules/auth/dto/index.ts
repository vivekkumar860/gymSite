export { passwordSchema } from './password-rules';

export { RegisterSchema } from './register.dto';
export type { RegisterDto } from './register.dto';

export { LoginSchema } from './login.dto';
export type { LoginDto } from './login.dto';

export { RefreshTokenSchema } from './refresh-token.dto';
export type { RefreshTokenDto } from './refresh-token.dto';

export { ForgotPasswordSchema } from './forgot-password.dto';
export type { ForgotPasswordDto } from './forgot-password.dto';

export { ForgotPasswordSchema as RequestPasswordResetSchema } from './forgot-password.dto';
export type { ForgotPasswordDto as RequestPasswordResetDto } from './forgot-password.dto';

export { ResetPasswordSchema } from './reset-password.dto';
export type { ResetPasswordDto } from './reset-password.dto';

export type { AuthResponseDto } from './auth-response.dto';
export type { CurrentUserResponseDto } from './current-user-response.dto';
