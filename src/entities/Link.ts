import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from './User';

export type LinkStatus = 'active' | 'expired' | 'inactive';

@Entity()
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  original_url!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  qr_code?: string;

  @Column({ type: 'varchar', default: 'active' })
  status!: LinkStatus;

  @Column({ type: 'datetime', nullable: true })
  expires_at?: Date;

  @Column({ type: 'int', default: 0 })
  click_count!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
