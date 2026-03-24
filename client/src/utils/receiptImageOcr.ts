import { preprocessReceiptForOcr, rotateReceiptPngBlob } from './receiptImagePreprocess';
import { estimateOcrTextQuality } from './receiptOcrQuality';
import { parseTransactionDateIso, parseVndTotal } from './receiptHeuristics';

export type ReceiptImageOcrResult = {
  text: string;
  confidence: number;
  /** Góc xoay (° CW) so với ảnh đã tiền xử lý, cho OCR tốt nhất */
  bestRotation: number;
};

const TRY_ROTATIONS = [0, 90, 180, 270] as const;

function scoreOcrCandidate(text: string, confidence: number): number {
  const q = estimateOcrTextQuality(text);
  let s = confidence * 0.42 + q.score * 52;
  if (parseVndTotal(text) != null) s += 28;
  if (parseTransactionDateIso(text) != null) s += 22;
  if (
    /(?:VND|VNĐ|TỔNG|TONG|NGÀY\s*GI[ỜỎ]|NGÀY\s*GIỜ|NGAY\s*GIO|THANH\s*TOÁN|THANH\s*TOAN|VISA|AGRIBANK)/iu.test(
      text,
    )
  ) {
    s += 10;
  }
  return s;
}

/**
 * OCR ảnh hoá đơn: tiền xử lý + thử 4 hướng xoay (POS VN thường chụp lệch 90°).
 */
export async function recognizeReceiptImage(
  file: File,
  onProgress?: (percent: number, message: string) => void,
): Promise<ReceiptImageOcrResult> {
  onProgress?.(2, 'Đang xử lý ảnh…');
  let baseBlob: Blob;
  try {
    baseBlob = await preprocessReceiptForOcr(file);
  } catch {
    baseBlob = file;
  }

  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createWorker('vie+eng', 1, {
    logger: (m) => {
      if (m.status === 'loading tesseract core') onProgress?.(5, 'Đang tải OCR…');
      if (m.status === 'loading language traineddata') onProgress?.(8, 'Đang tải ngôn ngữ…');
      if (m.status === 'initializing tesseract') onProgress?.(10, 'Khởi tạo…');
    },
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      preserve_interword_spaces: '1',
    });

    let bestText = '';
    let bestConf = 0;
    let bestRotation = 0;
    let bestScore = -1;

    for (let i = 0; i < TRY_ROTATIONS.length; i++) {
      const deg = TRY_ROTATIONS[i];
      onProgress?.(
        12 + Math.round((i / TRY_ROTATIONS.length) * 82),
        deg === 0 ? 'Đang đọc chữ (0°)…' : `Đang thử xoay ${deg}°…`,
      );

      const blob = await rotateReceiptPngBlob(baseBlob, deg);
      const result = await worker.recognize(blob, { rotateAuto: false });
      const text = result.data.text ?? '';
      const confidence =
        typeof result.data.confidence === 'number' && !Number.isNaN(result.data.confidence)
          ? result.data.confidence
          : 0;

      const sc = scoreOcrCandidate(text, confidence);
      if (sc > bestScore) {
        bestScore = sc;
        bestText = text;
        bestConf = confidence;
        bestRotation = deg;
      }

      const q = estimateOcrTextQuality(text);
      if (
        confidence >= 62 &&
        q.ok &&
        parseVndTotal(text) != null &&
        parseTransactionDateIso(text) != null
      ) {
        bestText = text;
        bestConf = confidence;
        bestRotation = deg;
        break;
      }
    }

    return { text: bestText, confidence: bestConf, bestRotation };
  } finally {
    await worker.terminate();
  }
}
