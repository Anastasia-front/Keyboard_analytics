import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import {
  Strategy as GithubStrategyBase,
  Profile,
  VerifyCallback,
} from 'passport-github2';

interface GithubUser {
  provider: string;
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  raw: Profile;
}

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(
  GithubStrategyBase,
  'github',
) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GITHUB_CLIENT_ID') || 'clientID',
      clientSecret:
        config.get<string>('GITHUB_CLIENT_SECRET') || 'clientSecret',
      callbackURL: `${config.get<string>('FRONT_BASE_URL')}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  validate(profile: Profile, done: VerifyCallback): void {
    const primaryEmail = profile.emails?.[0]?.value ?? null;

    const user: GithubUser = {
      provider: 'github',
      id: profile.id,
      email: primaryEmail,
      firstName: profile.displayName ?? profile.username ?? null,
      lastName: null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
      raw: profile,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    done(null, user);
  }
}
