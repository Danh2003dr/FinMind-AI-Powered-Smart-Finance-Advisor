import { Module } from '@nestjs/common';
import { AiAdvisorController } from '../controllers/ai-advisor.controller';
import { AiAdvisorService } from '../services/ai-advisor.service';

@Module({
  controllers: [AiAdvisorController],
  providers: [AiAdvisorService],
  exports: [AiAdvisorService],
})
export class AiModule {}
