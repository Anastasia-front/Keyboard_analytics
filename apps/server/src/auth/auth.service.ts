import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import bcrypt from 'bcrypt';

import { Response } from 'express';

import { UsersService } from '../users/users.service';

import type { AuthProviderName } from './auth.types';

import { User } from 'src/users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private users: UsersService,
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

    const payload: { sub: string } = { sub: userId };

    const expiresInConfig: string =
      this.config.get<string>('JWT_EXPIRES') ?? '7d';

    const options: JwtSignOptions = {
      secret,
      expiresIn: expiresInConfig,
    };

    return this.jwt.sign(payload, options);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.users.findByEmail(email);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new Error('Email already in use');

    // bcrypt.hash is now safely typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    const newUser = await this.users.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
    });

    return newUser;
  }

  async login(loginDto: LoginDto, res: Response): Promise<void> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      res.status(401).send('Invalid credentials');
      return;
    }

    const payload: { sub: string; email: string } = {
      sub: user.id,
      email: user.email ?? '',
    };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRESIN as string,
    });

    res.cookie('access_token', token, { httpOnly: true, secure: true });
    res.send({ message: 'Login successful' });
  }

  async oauthLogin(user: User, res: Response): Promise<void> {
    const payload: { sub: string; email: string } = {
      sub: user.id,
      email: user.email ?? '',
    };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRESIN as string,
    });

    res.cookie('access_token', token, { httpOnly: true, secure: true });
    res.redirect('/');
  }
}
