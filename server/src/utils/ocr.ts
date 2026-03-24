/**
 * Chuẩn hoá text thô từ OCR trước khi parse (stub — thay bằng pipeline thật).
 */
export function normalizeOcrText(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

export function stubParseReceiptLines(raw: string): { lines: string[] } {
  const text = normalizeOcrText(raw);
  return {
    lines: text
      ? text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
      : [],
  };
}
