import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @ManyToOne(() => User, (u) => u.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (t) => t.category)
  transactions: Transaction[];
}
