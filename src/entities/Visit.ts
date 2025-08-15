import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Link } from './Link';

@Entity()
export class Visit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Link, { onDelete: 'CASCADE' })
  link!: Link;

  @Column()
  ip_hash!: string; // hash/trunc do IP (não expor IP completo)

  @Column()
  user_agent!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
