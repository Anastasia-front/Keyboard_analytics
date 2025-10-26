import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import type { AuthProviderName } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
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

  signUserJwt(userId: string) {
    return this.jwt.sign({ sub: userId });
  }
}
