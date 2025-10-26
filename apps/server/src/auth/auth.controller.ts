import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { OAuthUser } from '../types/oauth-user';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  GithubAuthGuard,
  GoogleAuthGuard,
  LinkedinAuthGuard,
} from './guards/provider.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setAuthCookie(res: Response, token: string) {
    const cookieName = this.config.get<string>('COOKIE_NAME') || 'pg_auth';
    const secure = this.config.get<string>('COOKIE_SECURE') === 'true';
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }

  private redirectApp(res: Response, success: boolean) {
    const appUrl =
      this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    res.redirect(`${appUrl}/auth/${success ? 'success' : 'error'}`);
  }

  private async handleOAuthCallback(
    provider: 'google' | 'github' | 'linkedin',
    user: OAuthUser,
    res: Response,
  ) {
    try {
      const u = await this.auth.validateOAuthUser(provider, user);
      const jwt = this.auth.signUserJwt(u.id);
      this.setAuthCookie(res, jwt);
      this.redirectApp(res, true);
    } catch {
      this.redirectApp(res, false);
    }
  }

  // ---------- Google ----------
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user: OAuthUser = req.user as OAuthUser;
    await this.handleOAuthCallback('google', user, res);
  }

  // ---------- GitHub ----------
  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user: OAuthUser = req.user as OAuthUser;
    await this.handleOAuthCallback('github', user, res);
  }

  // ---------- LinkedIn ----------
  @Get('linkedin')
  @UseGuards(LinkedinAuthGuard)
  linkedinAuth() {}

  @Get('linkedin/callback')
  @UseGuards(LinkedinAuthGuard)
  async linkedinCallback(@Req() req: Request, @Res() res: Response) {
    const user: OAuthUser = req.user as OAuthUser;
    await this.handleOAuthCallback('linkedin', user, res);
  }

  // ---------- Who am I ----------
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    const user = req.user as OAuthUser & { createdAt?: Date };
    const { id, email, firstName, lastName, avatarUrl, createdAt } = user;
    return { id, email, firstName, lastName, avatarUrl, createdAt };
  }

  // ---------- Logout ----------
  @Get('logout')
  logout(@Res() res: Response) {
    const cookieName = this.config.get<string>('COOKIE_NAME') || 'pg_auth';
    res.clearCookie(cookieName, { path: '/' });
    res.send({ ok: true });
  }
}
