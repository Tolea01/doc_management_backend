export interface IRefreshTokenCookie {
  httpOnly: boolean;
  domain: string;
  sameSite: 'strict' | 'lax' | 'none';
  expires?: Date;
  secure: boolean;
  path: string;
}
