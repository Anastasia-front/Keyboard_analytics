export type AuthProviderName = 'google' | 'github' | 'linkedin';

export interface JwtPayload {
  sub: string; // user id
}
