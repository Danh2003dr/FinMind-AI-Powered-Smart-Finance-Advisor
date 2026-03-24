import { Injectable } from '@nestjs/common';
import { stubParseReceiptLines } from '../utils/ocr';

@Injectable()
export class OcrService {
  parseLines(text: string) {
    return stubParseReceiptLines(text);
  }
}
