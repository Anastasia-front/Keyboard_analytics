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
import { GoogleUser } from './strategies/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setAuthCookie(res: Response, token: string) {
    const cookieName = this.config.get<string>('COOKIE_NAME') || 'pg_auth';
    const cookieSecure = this.config.get<boolean>('COOKIE_SECURE') || false;
    const isProd = this.config.get<string>('ENV_TYPE') === 'production';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: cookieSecure, // only true in prod
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  private redirectApp(res: Response, success: boolean, token?: string) {
    const appUrl =
      this.config.get<string>('FRONT_BASE_URL') ?? 'http://localhost:3000';

    const redirectUrl = success
      ? `${appUrl}/auth/success${token ? `?token=${token}` : ''}`
      : `${appUrl}/auth/error`;

    res.redirect(redirectUrl);
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
    } catch (err) {
      console.error('OAuth callback error:', err);
      this.redirectApp(res, false);
    }
  }

  // ---------- Google ----------
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(GoogleAuthGuard)
  // async googleCallback(@Req() req: Request, @Res() res: Response) {
  //   const user: OAuthUser = req.user as OAuthUser;
  //   await this.handleOAuthCallback('google', user, res);
  // }
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('✅ Google callback triggered');
      console.log('User from Google:', req.user);
      const user = req.user as GoogleUser; // Typed as GoogleUser
      console.log('✅ Google callback triggered:', user);
      await this.handleOAuthCallback(
        'google',
        user as unknown as OAuthUser,
        res,
      );
    } catch (err) {
      console.error('❌ Error during Google callback:', err);
      res
        .status(500)
        .json({ message: 'Google auth callback failed', error: err.message });
    }
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
