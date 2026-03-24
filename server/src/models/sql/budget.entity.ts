import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  subtitle: string | null;

  @Column({ type: 'varchar', length: 64, default: 'category' })
  icon: string;

  @Column({ name: 'cap_amount', type: 'decimal', precision: 18, scale: 2 })
  capAmount: string;

  @Column({ type: 'varchar', length: 8, default: 'VND' })
  currency: string;
}
