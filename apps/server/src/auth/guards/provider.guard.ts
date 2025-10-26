import { AuthGuard } from '@nestjs/passport';

export class GoogleAuthGuard extends AuthGuard('google') {}
export class GithubAuthGuard extends AuthGuard('github') {}
export class LinkedinAuthGuard extends AuthGuard('linkedin') {}
