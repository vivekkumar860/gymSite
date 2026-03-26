/** Domain representation of an active auth session. */
export interface AuthSessionDomain {
  id: string;
  userId: string;
  refreshToken: string;
  deviceName: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}
