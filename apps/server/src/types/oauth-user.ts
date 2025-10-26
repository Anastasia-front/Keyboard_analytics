// types/oauth-user.ts
export interface OAuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  raw: any;
}
