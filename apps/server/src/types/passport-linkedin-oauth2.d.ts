declare module 'passport-linkedin-oauth2' {
  import { Strategy as PassportStrategy, Profile, VerifyCallback } from 'passport';

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    state?: boolean;
  }

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify?: (...args: any[]) => void);
  }

  export { Profile, VerifyCallback };
}
