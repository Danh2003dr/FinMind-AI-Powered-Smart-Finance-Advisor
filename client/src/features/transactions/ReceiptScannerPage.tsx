import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const receiptImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDtj4DCaMiBcZ9xTSqt5wWxM7a9Qc-BN6-swkErxHsirpeaUg0Gp_YxCAbBickf2xTH70DDUyaifOA3XukqYOimnyEAJlqST9FovRo2xhRAf637gVPpJqvV-I1_f15jSB2WLXjN2e0jPgbLHiRuI168QHs3wxZ1elxnybZtyXzA2jt4ohADC4xyi1_H5YYHfwwIJTPzMGQaJOb21q4JQtf7sQVbJoHy0gCu5QxDutetnSg6TmFnuU-y7kdmIXb22UPRuU7SZoT2PBtS';

const categories = ['Ẩm thực & Đồ uống', 'Di chuyển', 'Mua sắm', 'Giải trí'] as const;

export function ReceiptScannerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storeName, setStoreName] = useState('Starbucks Coffee - Vincom Center');
  const [date, setDate] = useState('2023-11-20');
  const [amount, setAmount] = useState('155,000 VND');
  const [category, setCategory] = useState<string>(categories[0]);

  function handleRescan() {
    setStoreName('');
    setAmount('');
    fileInputRef.current?.click();
  }

  function handleSave() {
    navigate('/transactions');
  }

  return (
    <div className="font-inter text-on-surface flex w-full min-w-0 flex-col justify-center py-2 md:py-0 min-h-[calc(100dvh-8rem)]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={() => {
          /* stub: sau này gọi OCR */
        }}
      />

      <header className="mb-6 shrink-0 md:mb-8">
        <h1 className="text-on-surface mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">AI Receipt Scanner</h1>
        <p className="text-on-surface-variant max-w-2xl text-sm md:text-base">
          Quét hoá đơn thông minh với OCR AI của FinMind.
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
                src={receiptImg}
              />
            </div>
            <div className="scanning-bar z-10" />
            <div className="absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="glass-panel flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-sky-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                  AI PROCESSING
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
              Độ chính xác: 98%
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col space-y-5 overflow-y-auto">
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
              onClick={handleRescan}
              className="border-sky-400/30 text-sky-300 flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-4 font-bold transition-all hover:bg-sky-400/5 active:scale-95"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              Quét lại
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-on-primary bg-primary flex flex-[2] items-center justify-center gap-2 rounded-xl px-6 py-4 font-black shadow-[0_4px_20px_rgba(125,211,252,0.3)] transition-all hover:brightness-110 active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              Xác nhận &amp; Lưu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
