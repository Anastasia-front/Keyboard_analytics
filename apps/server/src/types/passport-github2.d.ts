declare module 'passport-github2' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Profile, VerifyCallback } from 'passport';

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify?: (...args: any[]) => void);
  }

  export { Profile, VerifyCallback };
}
