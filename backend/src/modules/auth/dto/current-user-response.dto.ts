/** Shape of the authenticated user profile returned by GET /auth/me. */
export interface CurrentUserResponseDto {
  id: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}
