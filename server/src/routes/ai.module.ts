import { Module } from '@nestjs/common';
import { AiAdvisorService } from '../services/ai-advisor.service';

@Module({
  providers: [AiAdvisorService],
  exports: [AiAdvisorService],
})
export class AiModule {}
