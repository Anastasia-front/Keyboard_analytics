import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';

interface GoogleUser {
  provider: string;
  providerId: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') || 'clientID',
      clientSecret:
        config.get<string>('GOOGLE_CLIENT_SECRET') || 'clientSecret',
      callbackURL: `${config.get<string>('FRONT_BASE_UR')}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(profile: Profile, done: VerifyCallback): void {
    const user: GoogleUser = {
      provider: profile.provider,
      providerId: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    done(null, user);
  }
}
