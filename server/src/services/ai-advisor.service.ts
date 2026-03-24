import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatTurnDto } from '../dto/advisor-chat.dto';
import { advisorSystemPrompt } from '../utils/ai-prompts';

@Injectable()
export class AiAdvisorService {
  private readonly logger = new Logger(AiAdvisorService.name);

  constructor(private readonly config: ConfigService) {}

  async chat(
    messages: ChatTurnDto[],
  ): Promise<{ reply: string; provider: 'gemini' | 'fallback' }> {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'user') {
      throw new BadRequestException('Tin nhắn cuối phải là từ người dùng.');
    }

    const apiKey = this.config.get<string>('gemini.apiKey', '')?.trim() ?? '';
    if (!apiKey) {
      return {
        provider: 'fallback',
        reply:
          '[Chưa cấu hình GEMINI_API_KEY trên server] Thêm khóa từ Google AI Studio vào biến môi trường GEMINI_API_KEY, rồi khởi động lại API.',
      };
    }

    const modelName = this.config.get<string>('gemini.model', 'gemini-2.5-flash');
    const prior = messages.slice(0, -1);
    const history = prior.map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: advisorSystemPrompt,
      });
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(last.content);
      const text = result.response.text();
      if (!text?.trim()) {
        throw new Error('Phản hồi rỗng từ Gemini.');
      }
      return { reply: text, provider: 'gemini' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Gemini chat failed: ${msg}`);
      throw new BadGatewayException(`Không gọi được Gemini: ${msg}`);
    }
  }
}
