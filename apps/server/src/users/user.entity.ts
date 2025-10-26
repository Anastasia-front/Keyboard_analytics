import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl!: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  googleId!: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  githubId!: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  linkedinId!: string | null;

  // optional – for auditing
  @Column('jsonb', { nullable: true })
  profileRaw!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
