import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as LinkedinStrategyBase,
  Profile,
  VerifyCallback,
} from 'passport-linkedin-oauth2';

interface LinkedinUser {
  provider: string;
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  raw: Profile;
}

@Injectable()
export class LinkedinAuthStrategy extends PassportStrategy(
  LinkedinStrategyBase,
  'linkedin',
) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('LINKEDIN_CLIENT_ID') || 'clientID',
      clientSecret:
        config.get<string>('LINKEDIN_CLIENT_SECRET') || 'clientSecret',
      callbackURL: `${config.get<string>('API_URL')}/auth/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: false, // 👈 disables session-based state handling
    });
  }

  validate(profile: Profile, done: VerifyCallback): void {
    const email = profile.emails?.[0]?.value ?? null;
    const firstName = profile.name?.givenName ?? null;
    const lastName = profile.name?.familyName ?? null;
    const avatarUrl = profile.photos?.[0]?.value ?? null;

    const user: LinkedinUser = {
      provider: 'linkedin',
      id: profile.id,
      email,
      firstName,
      lastName,
      avatarUrl,
      raw: profile,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    done(null, user);
  }
}
