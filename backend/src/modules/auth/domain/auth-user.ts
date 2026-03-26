/** Domain representation of a user for auth purposes. */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  passwordHash: string | null;
  emailVerifiedAt: Date | null;
  failedLoginCount: number;
  lockedUntil: Date | null;
  createdAt: Date;
}
