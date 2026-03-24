/**
 * Chuẩn hoá một dòng OCR (khoảng trắng thừa trong dòng).
 */
export function normalizeOcrLine(line: string): string {
  return line.replace(/\s+/g, ' ').trim();
}

export function stubParseReceiptLines(raw: string): { lines: string[] } {
  const text = raw.trim();
  if (!text) return { lines: [] };
  return {
    lines: text
      .split(/\r?\n/)
      .map((l) => normalizeOcrLine(l))
      .filter(Boolean),
  };
}
