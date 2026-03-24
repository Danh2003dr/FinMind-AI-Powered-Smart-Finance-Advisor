import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { getCategories, postOcrParse, postTransaction } from '../../api/finance';
import { recognizeReceiptImage } from '../../utils/receiptImageOcr';
import { computeReceiptHeuristics } from '../../utils/receiptHeuristics';
import { estimateOcrTextQuality } from '../../utils/receiptOcrQuality';

const receiptImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDtj4DCaMiBcZ9xTSqt5wWxM7a9Qc-BN6-swkErxHsirpeaUg0Gp_YxCAbBickf2xTH70DDUyaifOA3XukqYOimnyEAJlqST9FovRo2xhRAf637gVPpJqvV-I1_f15jSB2WLXjN2e0jPgbLHiRuI168QHs3wxZ1elxnybZtyXzA2jt4ohADC4xyi1_H5YYHfwwIJTPzMGQaJOb21q4JQtf7sQVbJoHy0gCu5QxDutetnSg6TmFnuU-y7kdmIXb22UPRuU7SZoT2PBtS';

const SCANNER_CATEGORY_NAMES = new Set([
  'Ẩm thực & Đồ uống',
  'Di chuyển',
  'Mua sắm',
  'Giải trí',
]);

function parseVndAmountInput(s: string): number | null {
  const t = s.replace(/VND|VNĐ|đồng|đ/gi, '').trim();
  if (!t) return null;
  const n = parseInt(t.replace(/[^\d]/g, ''), 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

function formatApiError(err: unknown): string {
  if (isAxiosError(err)) {
    const m = err.response?.data as { message?: string | string[] } | undefined;
    if (typeof m?.message === 'string') return m.message;
    if (Array.isArray(m?.message)) return m.message.join(', ');
    return err.message || 'Không gọi được API.';
  }
  return 'Lỗi không xác định.';
}

export function ReceiptScannerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storeName, setStoreName] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [rawOcrText, setRawOcrText] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<{ pct: number; msg: string } | null>(null);

  const { data: apiCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const scannerCategories = useMemo(
    () => apiCategories.filter((c) => SCANNER_CATEGORY_NAMES.has(c.name)),
    [apiCategories],
  );

  useEffect(() => {
    if (scannerCategories.length === 0 || categoryId) return;
    setCategoryId(scannerCategories[0].id);
  }, [scannerCategories, categoryId]);

  async function ingestParsedText(
    text: string,
    meta?: { pageConfidence?: number; appliedRotation?: number },
  ): Promise<boolean> {
    const t = text.trim();
    if (!t) {
      setOcrError('Không có chữ nào đọc được. Thử ảnh rõ hơn, thẳng hơn, hoặc dán text thủ công.');
      return false;
    }
    setRawOcrText(t);
    const q = estimateOcrTextQuality(t);
    const trustTesseract =
      meta?.pageConfidence === undefined || meta.pageConfidence >= 34;
    const fillStore = q.ok && trustTesseract;

    if (!fillStore && meta?.pageConfidence !== undefined) {
      setStoreName('');
    }

    const { lines } = await postOcrParse(t);
    const fields = computeReceiptHeuristics(lines, { fillStore });

    if (fields.storeName !== undefined) setStoreName(fields.storeName);
    if (fields.date !== undefined) setDate(fields.date);
    if (fields.amount !== undefined) setAmount(fields.amount);
    if (fields.categorySuggestion) {
      const match = scannerCategories.find((c) => c.name === fields.categorySuggestion);
      if (match) setCategoryId(match.id);
    }

    const parts: string[] = [];
    if (!fillStore) {
      parts.push(
        'OCR có nhiều ký tự lạ hoặc độ tin cậy thấp — không tự điền tên cửa hàng. Sửa text hoặc chụp lại (sáng, phẳng, gần hoá đơn), rồi bấm «Phân tích text».',
      );
    }
    if (meta?.pageConfidence !== undefined && meta.pageConfidence < 42) {
      parts.push(`Tesseract ~${Math.round(meta.pageConfidence)}% — nên đối chiếu ngày và số tiền tay.`);
    }
    if (meta?.appliedRotation != null && meta.appliedRotation !== 0) {
      parts.push(`Đã thử xoay ảnh ${meta.appliedRotation}° để khớp hướng chữ in trên hoá đơn.`);
    }
    setOcrError(parts.length > 0 ? parts.join(' ') : null);
    return true;
  }

  async function runParse(text: string) {
    const t = text.trim();
    if (!t) {
      setOcrError('Hãy dán nội dung hoặc chọn file .txt / ảnh hoá đơn.');
      return;
    }
    setParsing(true);
    setOcrProgress(null);
    setOcrError(null);
    try {
      await ingestParsedText(t);
    } catch (err) {
      setOcrError(formatApiError(err));
    } finally {
      setParsing(false);
    }
  }

  async function onFileChange(ev: ChangeEvent<HTMLInputElement>) {
    const input = ev.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setOcrError(null);
    setOcrProgress(null);

    if (file.type.startsWith('image/')) {
      if (previewSrc?.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
      setPreviewSrc(URL.createObjectURL(file));
      setParsing(true);
      setOcrError(null);
      try {
        let ocr: Awaited<ReturnType<typeof recognizeReceiptImage>>;
        try {
          ocr = await recognizeReceiptImage(file, (pct, msg) => setOcrProgress({ pct, msg }));
        } catch {
          setOcrError(
            'Không chạy được OCR trên máy (cần mạng lần đầu để tải model, hoặc ảnh quá lớn). Bạn vẫn có thể dán text hoặc dùng file .txt.',
          );
          return;
        }
        setOcrProgress(null);
        try {
          await ingestParsedText(ocr.text, {
            pageConfidence: ocr.confidence,
            appliedRotation: ocr.bestRotation,
          });
        } catch (err) {
          setOcrError(formatApiError(err));
        }
      } finally {
        setParsing(false);
        setOcrProgress(null);
      }
      return;
    }

    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      const text = await file.text();
      await runParse(text);
      return;
    }

    setOcrError('Định dạng file chưa hỗ trợ (dùng ảnh, .txt hoặc dán text).');
  }

  function handleRescan() {
    setStoreName('');
    setAmount('');
    setOcrError(null);
    setSaveError(null);
    setRawOcrText('');
    if (previewSrc?.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(null);
    fileInputRef.current?.click();
  }

  async function handleSave() {
    setSaveError(null);
    const vnd = parseVndAmountInput(amount);
    if (!date.trim()) {
      setSaveError('Chọn ngày giao dịch.');
      return;
    }
    if (vnd == null) {
      setSaveError('Nhập tổng tiền hợp lệ (ví dụ 595.084 hoặc 595084 VND).');
      return;
    }
    if (!categoryId) {
      setSaveError('Chưa tải danh mục — thử tải lại trang.');
      return;
    }

    setSaving(true);
    try {
      const occurredAt = new Date(`${date}T12:00:00`).toISOString();
      const description = storeName.trim() || 'Chi tiêu từ hoá đơn';
      await postTransaction({
        amount: -vnd,
        currency: 'VND',
        description,
        occurredAt,
        categoryId,
        status: 'completed',
        methodType: 'card',
        methodLabel: 'POS / Hoá đơn',
      });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
      navigate('/transactions');
    } catch (err) {
      setSaveError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="font-inter text-on-surface flex w-full min-w-0 flex-col justify-center py-2 md:py-0 min-h-[calc(100dvh-8rem)]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.txt,text/plain"
        className="hidden"
        onChange={onFileChange}
      />

      <header className="mb-6 shrink-0 md:mb-8">
        <h1 className="text-on-surface mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">AI Receipt Scanner</h1>
        <p className="text-on-surface-variant max-w-2xl text-sm md:text-base">
          Hỗ trợ hoá đơn POS/Agribank: tự thử xoay 0°–270° (ảnh chụp ngang nhưng chữ in dọc), nhận «NGÀY GIỜ», «TỔNG … VND»,
          ưu tiên dòng có tên viện/ngân hàng. Ảnh nhăn hoặc mờ vẫn cần kiểm tra tay.
        </p>
      </header>

      <div className="glass-high flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-sky-400/10 shadow-[0_0_40px_rgba(125,211,252,0.06)] lg:min-h-[min(520px,calc(100dvh-11rem))] lg:max-h-[calc(100dvh-11rem)] lg:flex-row">
        {/* Cột xem trước + điều khiển chụp */}
        <div className="flex flex-col items-center justify-center border-b border-white/10 p-6 sm:p-8 lg:w-[min(46%,420px)] lg:flex-none lg:border-b-0 lg:border-r">
          <div className="glass-elevated group relative aspect-[3/4] w-full max-w-[min(100%,300px)] overflow-hidden rounded-xl shadow-[0_0_50px_rgba(125,211,252,0.12)] sm:max-w-[320px] lg:max-h-[min(440px,calc(100dvh-14rem))] lg:w-full lg:max-w-none">
            <div className="absolute inset-0 z-0">
              <img
                alt="Hoá đơn đang được quét"
                className="h-full w-full object-cover opacity-80"
                src={previewSrc ?? receiptImg}
              />
            </div>
            <div className="scanning-bar z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="glass-panel max-w-[min(100%,220px)] truncate text-center text-[9px] font-bold leading-tight tracking-widest text-sky-300 sm:max-w-[260px] sm:text-[10px]">
                  <span
                    className={`mr-1.5 inline-block h-2 w-2 rounded-full bg-sky-400 align-middle ${parsing ? 'animate-pulse' : ''}`}
                  />
                  <span className="align-middle">
                    {ocrProgress
                      ? `${ocrProgress.msg} ${ocrProgress.pct}%`
                      : parsing
                        ? 'ĐANG XỬ LÝ…'
                        : 'SẴN SÀNG'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:bg-white/20 sm:h-10 sm:w-10"
                    aria-label="Đèn flash"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">flash_on</span>
                  </button>
                  <Link
                    to="/transactions"
                    className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:bg-white/20 sm:h-10 sm:w-10"
                    aria-label="Đóng"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
                  </Link>
                </div>
              </div>
              <div className="relative h-1/2 w-full">
                <div className="absolute left-1/4 top-1/4 h-3 w-3 rounded-sm border-2 border-sky-300/60" />
                <div className="absolute right-1/4 top-1/3 h-3 w-3 rounded-sm border-2 border-sky-300/60" />
                <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-sm border-2 border-sky-300/60" />
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-panel flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span className="material-symbols-outlined text-lg">photo_library</span>
                  Thư viện
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-on-primary bg-primary flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold shadow-[0_0_20px_rgba(125,211,252,0.4)] transition-all hover:brightness-110 active:scale-95 sm:px-8 sm:py-3 sm:text-sm"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    photo_camera
                  </span>
                  Chụp ảnh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form xác nhận — cùng panel, chiếm phần còn lại */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-950/20 p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-on-surface text-xl font-bold">Xác nhận dữ liệu</h2>
            <span className="shrink-0 rounded border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-xs font-semibold text-sky-300">
              OCR tự động + kiểm tra tay
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col space-y-5 overflow-y-auto">
            {ocrError ? (
              <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
                {ocrError}
              </p>
            ) : null}
            {saveError ? (
              <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {saveError}
              </p>
            ) : null}

            <div className="space-y-2">
              <label className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                Text hoá đơn (OCR ảnh điền vào đây — có thể sửa tay)
              </label>
              <textarea
                value={rawOcrText}
                onChange={(e) => setRawOcrText(e.target.value)}
                placeholder="HIGHLANDS&#10;20/11/2023&#10;TỔNG CỘNG: 155.000 VND"
                rows={4}
                className="border-outline-variant bg-surface-variant/40 text-on-surface focus:border-primary focus:ring-primary w-full resize-y rounded-lg border p-3 text-sm transition-all focus:ring-1"
              />
              <button
                type="button"
                disabled={parsing || !rawOcrText.trim()}
                onClick={() => runParse(rawOcrText)}
                className="text-on-primary bg-primary w-full rounded-lg py-2.5 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
              >
                {parsing ? 'Đang phân tích…' : 'Phân tích text'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                Tên cửa hàng
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/60">
                  storefront
                </span>
                <input
                  className="border-outline-variant bg-surface-variant/40 text-on-surface focus:border-primary focus:ring-primary w-full rounded-lg border py-3 pl-11 pr-4 transition-all focus:ring-1"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                Ngày giao dịch
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/60">
                  calendar_today
                </span>
                <input
                  className="border-outline-variant bg-surface-variant/40 text-on-surface focus:border-primary focus:ring-primary w-full rounded-lg border py-3 pl-11 pr-4 transition-all focus:ring-1"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                Tổng tiền
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/60">
                  payments
                </span>
                <input
                  className="border-outline-variant bg-surface-variant/40 text-on-surface focus:border-primary focus:ring-primary w-full rounded-lg border py-3 pl-11 pr-4 text-lg font-bold transition-all focus:ring-1"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">
                Danh mục
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/60">
                  category
                </span>
                <select
                  className="border-outline-variant bg-surface-variant/40 text-on-surface focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border py-3 pl-11 pr-10 transition-all focus:ring-1"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={scannerCategories.length === 0}
                >
                  {scannerCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex shrink-0 flex-col gap-4 border-t border-sky-400/10 pt-6 sm:flex-row">
            <button
              type="button"
              disabled={parsing}
              onClick={handleRescan}
              className="border-sky-400/30 text-sky-300 flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-4 font-bold transition-all hover:bg-sky-400/5 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              Quét lại
            </button>
            <button
              type="button"
              disabled={parsing || saving || scannerCategories.length === 0}
              onClick={() => void handleSave()}
              className="text-on-primary bg-primary flex flex-[2] items-center justify-center gap-2 rounded-xl px-6 py-4 font-black shadow-[0_4px_20px_rgba(125,211,252,0.3)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              {saving ? 'Đang lưu…' : 'Xác nhận &amp; Lưu'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
