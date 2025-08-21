import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Counter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ default: 0 })
  count: number;
}
