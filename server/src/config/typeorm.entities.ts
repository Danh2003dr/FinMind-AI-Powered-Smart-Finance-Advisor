import { Account } from '../models/sql/account.entity';
import { Budget } from '../models/sql/budget.entity';
import { Category } from '../models/sql/category.entity';
import { Notification } from '../models/sql/notification.entity';
import { SavingGoal } from '../models/sql/saving-goal.entity';
import { Transaction } from '../models/sql/transaction.entity';
import { User } from '../models/sql/user.entity';

export const TYPEORM_ENTITIES = [
  User,
  Category,
  Transaction,
  Budget,
  SavingGoal,
  Account,
  Notification,
];
