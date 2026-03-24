import { Module } from '@nestjs/common';
import { AiModule } from './ai.module';
import { AuthModule } from './auth.module';
import { HealthModule } from './health.module';

@Module({
  imports: [AuthModule, HealthModule, AiModule],
})
export class AppRoutesModule {}
