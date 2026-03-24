import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OcrParseDto } from '../dto/finance.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { OcrService } from '../services/ocr.service';

@Controller('ocr')
@UseGuards(JwtAuthGuard)
export class OcrController {
  constructor(private readonly ocr: OcrService) {}

  @Post('receipts/parse')
  parse(@CurrentUser() _user: unknown, @Body() dto: OcrParseDto) {
    return this.ocr.parseLines(dto.text);
  }
}
