import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('saving_goals')
export class SavingGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 256 })
  title: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  subtitle: string | null;

  @Column({ name: 'target_amount', type: 'decimal', precision: 18, scale: 2 })
  targetAmount: string;

  @Column({ name: 'current_amount', type: 'decimal', precision: 18, scale: 2, default: '0' })
  currentAmount: string;

  @Column({ name: 'target_date', type: 'datetime', nullable: true })
  targetDate: Date | null;

  @Column({ type: 'varchar', length: 64, default: 'flag' })
  icon: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  badge: string | null;

  @Column({ type: 'varchar', length: 32, default: 'medium' })
  priority: string;
}
