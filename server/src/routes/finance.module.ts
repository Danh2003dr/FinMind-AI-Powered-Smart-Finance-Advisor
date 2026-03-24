import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../models/sql/account.entity';
import { Budget } from '../models/sql/budget.entity';
import { Category } from '../models/sql/category.entity';
import { Notification } from '../models/sql/notification.entity';
import { SavingGoal } from '../models/sql/saving-goal.entity';
import { Transaction } from '../models/sql/transaction.entity';
import { User } from '../models/sql/user.entity';
import { AccountsController } from '../controllers/accounts.controller';
import { BudgetsController } from '../controllers/budgets.controller';
import { CategoriesController } from '../controllers/categories.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { NotificationsController } from '../controllers/notifications.controller';
import { OcrController } from '../controllers/ocr.controller';
import { SavingGoalsController } from '../controllers/saving-goals.controller';
import { TransactionsController } from '../controllers/transactions.controller';
import { AccountsService } from '../services/accounts.service';
import { BudgetsService } from '../services/budgets.service';
import { CategoriesService } from '../services/categories.service';
import { DashboardService } from '../services/dashboard.service';
import { NotificationsService } from '../services/notifications.service';
import { OcrService } from '../services/ocr.service';
import { SavingGoalsService } from '../services/saving-goals.service';
import { TransactionsService } from '../services/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Category,
      Transaction,
      Budget,
      SavingGoal,
      Account,
      Notification,
    ]),
  ],
  controllers: [
    CategoriesController,
    TransactionsController,
    BudgetsController,
    SavingGoalsController,
    AccountsController,
    NotificationsController,
    DashboardController,
    OcrController,
  ],
  providers: [
    CategoriesService,
    TransactionsService,
    BudgetsService,
    SavingGoalsService,
    AccountsService,
    NotificationsService,
    DashboardService,
    OcrService,
  ],
})
export class FinanceModule {}
