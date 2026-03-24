import { Module } from '@nestjs/common';
import { AiModule } from './ai.module';
import { AuthModule } from './auth.module';
import { FinanceModule } from './finance.module';
import { HealthModule } from './health.module';

@Module({
  imports: [AuthModule, HealthModule, AiModule, FinanceModule],
})
export class AppRoutesModule {}
