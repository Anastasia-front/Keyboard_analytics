import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';

export interface GoogleUser {
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
      callbackURL: `${config.get<string>('BACK_BASE_URL')}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const user: GoogleUser = {
        provider: profile.provider,
        providerId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
      };

      done(null, user);
    } catch (err) {
      done(err as Error, null);
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, VerifyCallback } from 'passport-google-oauth20';

// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { AuthService } from '../auth.service';
// // Reuse your GoogleUser interface
// export interface GoogleUser {
//   provider: string;
//   providerId: string;
//   displayName: string;
//   emails?: { value: string }[];
//   photos?: { value: string }[];
// }

// @Injectable()
// export class GoogleAuthStrategy extends PassportStrategy(
//   GoogleStrategy,
//   'google',
// ) {
//   constructor(
//     config: ConfigService,
//     private auth: AuthService,
//   ) {
//     super({
//       clientID: config.get<string>('GOOGLE_CLIENT_ID') || 'clientID',
//       clientSecret:
//         config.get<string>('GOOGLE_CLIENT_SECRET') || 'clientSecret',
//       callbackURL: `${config.get<string>('FRONT_BASE_UR')}/auth/google/callback`,
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: VerifyCallback,
//   ): Promise<void> {
//     try {
//       // Build a typed GoogleUser
//       const googleUser: GoogleUser = {
//         provider: profile.provider,
//         providerId: profile.id,
//         displayName: profile.displayName,
//         emails: profile.emails,
//         photos: profile.photos,
//       };

//       // Convert to your app's internal structure for saving
//       const user = await this.auth.validateOAuthUser('google', {
//         id: googleUser.providerId,
//         email: googleUser.emails?.[0]?.value ?? null,
//         firstName: googleUser.displayName?.split(' ')?.[0] ?? null,
//         lastName:
//           googleUser.displayName?.split(' ')?.slice(1).join(' ') ?? null,
//         avatarUrl: googleUser.photos?.[0]?.value ?? null,
//       });

//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   }
// }
