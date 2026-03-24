import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { advisorSystemPrompt } from '../utils/ai-prompts';

@Injectable()
export class AiAdvisorService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Gọi OpenAI (hoặc provider khác) tại đây khi đã có API key.
   */
  draftReply(userMessage: string): string {
    const key = this.config.get<string>('openai.apiKey', '');
    if (!key) {
      return `[Chưa cấu hình OPENAI_API_KEY] ${advisorSystemPrompt.slice(0, 80)}… — Tin nhắn: ${userMessage}`;
    }
    return `Stub phản hồi AI cho: ${userMessage}`;
  }
}
