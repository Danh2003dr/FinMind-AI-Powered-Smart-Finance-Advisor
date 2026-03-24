import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 8, default: 'VND' })
  currency: string;

  @Column({ type: 'varchar', length: 512 })
  description: string;

  @Column({ name: 'occurred_at', type: 'datetime' })
  occurredAt: Date;

  @Column({ type: 'varchar', length: 16, default: 'completed' })
  status: string;

  @Column({ name: 'method_type', type: 'varchar', length: 16, nullable: true })
  methodType: string | null;

  @Column({ name: 'method_label', type: 'varchar', length: 128, nullable: true })
  methodLabel: string | null;

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (c) => c.transactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;
}
