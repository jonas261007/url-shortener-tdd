import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { User } from './User';
import { Visit } from './Visit';

export type LinkStatus = 'active' | 'expired' | 'inactive';

@Entity()
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.links)
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

  @OneToMany(() => Visit, visit => visit.link)
  visits!: Visit[];

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;
}
