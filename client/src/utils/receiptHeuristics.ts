import { isPlausibleStoreLine } from './receiptOcrQuality';

/** Gợi ý tên đơn vị trên hoá đơn POS / ngân hàng VN (Agribank, viện, siêu thị…). */
const POS_MERCHANT_HINTS =
  /VIỆN|VIEN|Y\s*DƯỢC|Y\s*DUOC|ĐẠI\s*HỌC|DAI\s*H[ỌO0]C|DAI\s*HOC|BỆNH\s*VIỆN|BENH\s*VIEN|B\.\s*VI|BV\d|SIÊU\s*TH|CỬA\s*HÀNG|CUA\s*HANG|TRUNG\s*TÂM|TRUNG\s*TAM/i;
const POS_BANK_HINTS =
  /AGRIBANK|NGÂN\s*HÀNG\s*NÔNG|NGAN\s*HANG\s*NONG|VIETCOMBANK|VIETINBANK|BIDV|SACOMBANK|TECHCOMBANK|TPBANK|MBBANK|MSBANK/i;
const POS_LOCATION_HINTS =
  /NGUYỄN\s*CHÍ\s*THANH|NGUYEN\s*CHI\s*THANH|HCM\b|H\s*C\s*M\b|Q\.\s*5|P\.\s*12|VIỆT\s*NAM|VIET\s*NAM|VNM\b/i;

function merchantLineScore(line: string): number {
  const l = line.trim();
  if (l.length < 4) return -1;
  let s = 0;
  if (POS_MERCHANT_HINTS.test(l)) s += 48;
  if (POS_BANK_HINTS.test(l)) s += 30;
  if (POS_LOCATION_HINTS.test(l)) s += 14;
  if (isPlausibleStoreLine(l)) s += 18;
  s += Math.min(22, Math.floor(l.length / 6));
  if (/THANH\s*TOÁN|THANH\s*TOAN|SỐ\s*THẺ|SO\s*THE|VISA|MASTER|^\d{4}\s+X+/i.test(l)) s -= 45;
  if (/^\d[\d\s]*$/.test(l)) s -= 55;
  return s;
}

/**
 * Gỡ tiền tố cột số («2 B.VIEN…»), viền |, và hậu tố 1 chữ rác («… HCM h»).
 */
export function sanitizeStoreName(raw: string): string {
  let s = raw.replace(/\s+/g, ' ').trim();
  if (!s) return '';
  s = s.replace(/^[|•\s._\-–—:/\\]+/u, '');
  s = s.replace(/^[|•\s]*\d{1,3}\s+(?=[A-Za-zÀ-ỹ.])/u, '');
  s = s.replace(/\s*[|•]+\s*$/u, '');
  const parts = s.split(/\s+/).filter(Boolean);
  while (
    parts.length > 1 &&
    parts[parts.length - 1].length === 1 &&
    /^[a-z]$/i.test(parts[parts.length - 1])
  ) {
    parts.pop();
  }
  return parts.join(' ').trim();
}

/** Gợi ý danh mục theo từ khóa hoá đơn (trùng với dropdown app). */
export function suggestReceiptCategory(blob: string): string | null {
  if (
    /VIỆN|VIEN|B\.\s*VI|BV\d|Y\s*DƯỢC|Y\s*DUOC|ĐẠI\s*HỌC\s*Y|DAI\s*HOC\s*Y|BỆNH\s*VIỆN|BENH\s*VIEN|PHÒNG\s*KHÁM|PHONG\s*KHAM|BÁC\s*SĨ/i.test(
      blob,
    )
  ) {
    return 'Mua sắm';
  }
  if (/GRAB|BE\s|Gojek|TAXI|XĂNG|XANG|PETROL|PVOIL|VÉ\s*MÁY\s*BAY|VE\s*MAY\s*BAY/i.test(blob)) {
    return 'Di chuyển';
  }
  if (
    /HIGHLANDS|STARBUCKS|PHÚC\s*LONG|COFFEE|NHÀ\s*HÀNG|NHA\s*HANG|ĂN\s*UỐNG|AN\s*UONG|QUÁN\s*ĂN|QUAN\s*AN/i.test(
      blob,
    )
  ) {
    return 'Ẩm thực & Đồ uống';
  }
  if (/RẠP\s*CHIẾU|GAME|NETFLIX|SPOTIFY|KARAOKE/i.test(blob)) {
    return 'Giải trí';
  }
  return null;
}

export function pickStoreLine(lines: string[]): string {
  const head = lines.slice(0, 22).map((l) => l.trim()).filter(Boolean);
  let best = '';
  let bestS = 0;
  for (const l of head) {
    const sc = merchantLineScore(l);
    if (sc > bestS) {
      bestS = sc;
      best = l;
    }
  }
  if (bestS >= 40) return best;

  const plausible = head.filter(isPlausibleStoreLine);
  const withLetters = plausible.filter((l) => /[A-Za-zÀ-ỹà-ỹ]/.test(l));
  const pool = withLetters.length > 0 ? withLetters : plausible;
  if (pool.length === 0) return '';
  return pool.reduce((a, b) => (b.length > a.length ? b : a));
}

export function parseVndTotal(blob: string): number | null {
  /** POS Agribank hay in «TỔNG: VND 595,084» (tiền tệ đứng trước số). */
  const tongVndFirst = blob.match(
    /(?:TONG|TỔNG|PỊ\s*TONG|P\s*[ỊI1l|]\s*TONG|TỊ\s*TONG)\s*[:\s]*(?:VND|VNĐ)\s*([\d]{1,3}(?:,\d{3})+|\d{4,9})(?!\d)/iu,
  );
  if (tongVndFirst?.[1]) {
    const n = parseInt(tongVndFirst[1].replace(/[^\d]/g, ''), 10);
    if (!Number.isNaN(n) && n >= 100) return n;
  }

  const primary = [
    /(?:TONG|TỔNG)\s*\)?\s*[:\s]*([\d][\d.,\s]*)\s*(?:VND|VNĐ|đ|dong)?/i,
    /(?:TONG|TỔNG|TỔNG\s*CỘNG|TONG\s*CONG|TOTAL)\s*[:(]*\s*([\d][\d.,\s]*)\s*(?:VND|VNĐ|đ|d)/i,
  ];
  for (const re of primary) {
    const m = blob.match(re);
    if (m?.[1]) {
      const n = parseInt(m[1].replace(/[^\d]/g, ''), 10);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }
  const withCurrency = blob.match(/\b([\d]{1,3}(?:,\d{3})+)\s*(?:VND|VNĐ)\b/i);
  if (withCurrency?.[1]) {
    const n = parseInt(withCurrency[1].replace(/[^\d]/g, ''), 10);
    if (!Number.isNaN(n) && n >= 100) return n;
  }
  const dotThousands = blob.match(/\b([\d]{1,3}(?:\.\d{3})+)\s*(?:VND|VNĐ)\b/i);
  if (dotThousands?.[1]) {
    const n = parseInt(dotThousands[1].replace(/\./g, ''), 10);
    if (!Number.isNaN(n) && n >= 100) return n;
  }
  return null;
}

/** Trả về yyyy-mm-dd cho input type=date */
export function parseTransactionDateIso(blob: string): string | null {
  /** OCR hay nhầm GIỜ → GIỎ / GIO; cho phép rác ` ' " • giữa nhãn và số */
  const ngayGio = blob.match(
    /(?:NGÀY\s*GI[ỜỎ]|NGÀY\s*GIỜ|NGAY\s*GI[OÒ0Ó]|NGÀY\s*GIO|NGAY\s*GIO)\s*[:\s`'"/•|\\._-]*\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:\s+[\d:\s.]+)?/iu,
  );
  if (ngayGio) {
    const d = Number(ngayGio[1]);
    const mo = Number(ngayGio[2]);
    const y = Number(ngayGio[3]);
    if (y >= 1990 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }

  const ymd = blob.match(/\b(20\d{2}|19\d{2})[/.-](\d{1,2})[/.-](\d{1,2})\b/);
  if (ymd) {
    const y = Number(ymd[1]);
    const mo = Number(ymd[2]);
    const d = Number(ymd[3]);
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  const dm = blob.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (!dm) return null;
  const d = Number(dm[1]);
  const mo = Number(dm[2]);
  let y = Number(dm[3]);
  if (y < 100) y += 2000;
  if (y < 1990 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export type ReceiptHeuristicFields = {
  storeName?: string;
  date?: string;
  amount?: string;
  /** Một trong nhãn dropdown nếu khớp từ khóa */
  categorySuggestion?: string;
};

export function computeReceiptHeuristics(
  lines: string[],
  options: { fillStore: boolean },
): ReceiptHeuristicFields {
  if (lines.length === 0) return {};
  const blob = lines.join('\n');
  const out: ReceiptHeuristicFields = {};

  if (options.fillStore) {
    const store = pickStoreLine(lines);
    if (store) out.storeName = sanitizeStoreName(store);
  }

  const cat = suggestReceiptCategory(blob);
  if (cat) out.categorySuggestion = cat;

  const iso = parseTransactionDateIso(blob);
  if (iso) out.date = iso;

  const total = parseVndTotal(blob);
  if (total != null) out.amount = `${total.toLocaleString('vi-VN')} VND`;

  return out;
}
