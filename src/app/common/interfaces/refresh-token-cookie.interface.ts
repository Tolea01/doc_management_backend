export interface IRefreshTokenCookie {
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  expires: Date;
  secure: boolean;
  path: string;
}
