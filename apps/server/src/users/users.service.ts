import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByProviderId(
    provider: 'google' | 'github' | 'linkedin',
    providerId: string,
  ) {
    const where =
      provider === 'google'
        ? { googleId: providerId }
        : provider === 'github'
          ? { githubId: providerId }
          : { linkedinId: providerId };
    return this.repo.findOne({ where });
  }

  async findByEmail(email?: string | null) {
    if (!email) return null;
    return this.repo.findOne({ where: { email } });
  }

  async upsertOAuthUser(input: {
    provider: 'google' | 'github' | 'linkedin';
    providerId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    profileRaw?: Record<string, unknown> | null;
  }) {
    let user = await this.findByProviderId(input.provider, input.providerId);

    if (!user && input.email) {
      // Optional: link by email if already exists
      user = await this.findByEmail(input.email);
    }

    if (!user) {
      user = this.repo.create({
        email: input.email ?? null,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        avatarUrl: input.avatarUrl ?? null,
        profileRaw: input.profileRaw ?? null,
        googleId: input.provider === 'google' ? input.providerId : null,
        githubId: input.provider === 'github' ? input.providerId : null,
        linkedinId: input.provider === 'linkedin' ? input.providerId : null,
      });
    } else {
      // update provider link & fields
      if (input.provider === 'google') user.googleId = input.providerId;
      if (input.provider === 'github') user.githubId = input.providerId;
      if (input.provider === 'linkedin') user.linkedinId = input.providerId;

      user.email = user.email ?? input.email ?? null;
      user.firstName = user.firstName ?? input.firstName ?? null;
      user.lastName = user.lastName ?? input.lastName ?? null;
      user.avatarUrl = user.avatarUrl ?? input.avatarUrl ?? null;
      user.profileRaw = input.profileRaw ?? user.profileRaw;
    }

    return this.repo.save(user);
  }
}
