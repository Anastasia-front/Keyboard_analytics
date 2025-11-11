import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { OAuthUser } from '../types/oauth-user';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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

  // ---------- Helpers ----------
  private setAuthCookie(res: Response, token: string) {
    const cookieName = this.config.get<string>('COOKIE_NAME') || 'pg_auth';
    const cookieSecure = this.config.get<boolean>('COOKIE_SECURE') || false;
    const isProd = this.config.get<string>('ENV_TYPE') === 'production';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: cookieSecure,
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
      console.error(`OAuth callback error [${provider}]:`, err);
      this.redirectApp(res, false);
    }
  }

  // ---------- Custom Email/Password Register ----------

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.auth.register(dto);
      const token = this.auth.signUserJwt(user.id);
      this.setAuthCookie(res, token);
      res.send({ message: 'Registration successful', user });
    } catch (err) {
      console.error('❌ Registration error:', err);
      res
        .status(400)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        .json({ message: 'Registration failed', error: err.message ?? err });
    }
  }

  // ---------- Custom Email/Password Login ----------
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      // Let AuthService handle validation + JWT creation
      await this.auth.login(loginDto, res);
    } catch (err) {
      console.error('❌ Email/password login error:', err);
      res
        .status(500)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        .json({ message: 'Login failed', error: err.message ?? err });
    }
  }

  // ---------- Google ----------
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as GoogleUser;
      await this.handleOAuthCallback(
        'google',
        user as unknown as OAuthUser,
        res,
      );
    } catch (err) {
      console.error('❌ Google callback error:', err);
      res
        .status(500)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
