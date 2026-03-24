import { Body, Controller, Post } from '@nestjs/common';
import { AdvisorChatDto } from '../dto/advisor-chat.dto';
import { AiAdvisorService } from '../services/ai-advisor.service';

@Controller('ai/advisor')
export class AiAdvisorController {
  constructor(private readonly aiAdvisor: AiAdvisorService) {}

  @Post('chat')
  chat(@Body() body: AdvisorChatDto) {
    return this.aiAdvisor.chat(body.messages);
  }
}
