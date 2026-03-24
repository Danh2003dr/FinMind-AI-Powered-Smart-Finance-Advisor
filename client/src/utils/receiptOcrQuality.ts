/** Dòng có vẻ là tên đơn vị (tránh điền rác OCR vào «tên cửa hàng»). */
export function isPlausibleStoreLine(line: string): boolean {
  const t = line.trim();
  if (t.length < 3 || t.length > 140) return false;
  const nonSpace = t.replace(/\s/g, '');
  if (nonSpace.length < 3) return false;
  const letters = (t.match(/[A-Za-zÀ-ỹà-ỹ]/g) || []).length;
  const alphaRatio = letters / nonSpace.length;
  if (alphaRatio < 0.38) return false;
  const bad = (t.match(/[•●▪◆[\]{}|\\<>+=*&%^$#@~`]/g) || []).length;
  if (bad > Math.min(10, Math.ceil(t.length / 5))) return false;
  return true;
}

/**
 * Heuristic: OCR rác thường nhiều ký tự lạ, từ 1 chữ rời rạc.
 * Trả về ok=false → không tự điền tên cửa hàng (vẫn có thể bắt ngày/tiền nếu regex trúng).
 */
export function estimateOcrTextQuality(text: string): { ok: boolean; score: number } {
  const s = text.replace(/\r\n/g, '\n').trim();
  if (s.length < 10) return { ok: false, score: 0 };

  const sample = s.slice(0, 2800);
  const tokens = sample.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { ok: false, score: 0 };

  const longTok = tokens.filter((x) => x.length >= 2).length;
  const tokenOk = tokens.length < 8 || longTok / tokens.length >= 0.28;

  let letters = 0;
  let digits = 0;
  let other = 0;
  for (const ch of sample) {
    if (/[A-Za-zÀ-ỹà-ỹ]/.test(ch)) letters++;
    else if (/\d/.test(ch)) digits++;
    else if (!/\s/.test(ch)) other++;
  }
  const nonSpace = sample.replace(/\s/g, '').length;
  if (nonSpace === 0) return { ok: false, score: 0 };

  const meaningful = letters + digits;
  const ratio = meaningful / nonSpace;
  const weirdRatio = other / sample.length;

  const score = ratio * (1 - Math.min(1, weirdRatio * 2.5)) * (tokenOk ? 1 : 0.5);
  const ok = ratio >= 0.4 && weirdRatio < 0.14 && tokenOk;

  return { ok, score };
}
