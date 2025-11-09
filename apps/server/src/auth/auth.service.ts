import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import type { AuthProviderName } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateOAuthUser(
    provider: AuthProviderName,
    profile: {
      id: string;
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      avatarUrl?: string | null;
      raw?: Record<string, unknown> | null;
    },
  ) {
    const user = await this.users.upsertOAuthUser({
      provider,
      providerId: profile.id,
      email: profile.email ?? null,
      firstName: profile.firstName ?? null,
      lastName: profile.lastName ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      profileRaw: profile.raw ?? null,
    });
    return user;
  }

  signUserJwt(userId: string): string {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const payload = { sub: userId };

    // get expiresIn from config, fallback to 7 days
    const expiresInConfig = this.config.get<string>('JWT_EXPIRES') ?? '7d';

    // Cast to any to bypass TS error
    return this.jwt.sign(payload as any, {
      secret,
      expiresIn: expiresInConfig as any,
    });
  }
}
