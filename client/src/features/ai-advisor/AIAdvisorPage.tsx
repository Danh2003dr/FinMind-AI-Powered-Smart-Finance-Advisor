import { useState } from 'react';

const userAvatarImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD6vM16IfmAjzqVjetZlh83W6gFSgOXT2L_d-S_QclDiGgp-O-NiPz_qGqbhv6fn1osxj870E-cL_k2_NK3TuVFMwS0kUvOW0nQPTpr2TNSlq_8D8WNtCJUyG6dx4emQT1lDQX85dyyzvQqaFpC0gk-_jpj9Ma_edpaRjzhf5vnJngt_v1mVbkOi-VUmJAE7tI8HJN7g1ZzkaNQRhzwnW2wha_RTeyt_tB4xKoZrJmbOrfDIKqptvOfJlLWB_lUTPpKDkquzIys7F4v';

const SUGGESTIONS = [
  'Làm sao để tiết kiệm thêm 500 USD tháng này?',
  'Phân tích thói quen ăn uống chi tiêu của tôi',
  'Dự báo giá trị tài sản ròng cuối năm',
  'Đánh giá rủi ro danh mục đầu tư',
] as const;

function AiAvatar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`glass-elevated ai-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 ${className}`}
    >
      <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
        psychology
      </span>
    </div>
  );
}

export function AIAdvisorPage() {
  const [draft, setDraft] = useState('');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-sky-400/10 bg-slate-950/30 lg:min-h-[min(640px,calc(100dvh-8rem))] lg:max-h-[calc(100dvh-8rem)] lg:flex-row">
      {/* Khu chat */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 -translate-y-1/2 translate-x-1/4 rounded-full bg-sky-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/4 rounded-full bg-tertiary/10 blur-[120px]" />

        <div className="scrollbar-hide flex flex-1 flex-col space-y-8 overflow-y-auto scroll-smooth px-6 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="glass-elevated ai-glow flex h-16 w-16 items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-on-surface text-2xl font-bold tracking-tight">FinMind Financial Advisor</h1>
              <p className="text-on-surface-variant text-sm">Thông minh thời gian thực cho dòng tiền của bạn</p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-col space-y-8">
            <div className="flex max-w-[85%] items-start gap-4">
              <AiAvatar />
              <div className="glass-elevated rounded-2xl rounded-tl-none border border-sky-400/20 p-5 shadow-xl">
                <p className="text-on-surface leading-relaxed">
                  Chào buổi chiều! Mình đã phân tích chi tiêu 14 ngày qua của bạn. Bạn đã giảm chi ăn uống{' '}
                  <span className="font-bold text-primary">18%</span> so với tháng trước.
                </p>
                <p className="text-on-surface mt-2 leading-relaxed">
                  Bạn muốn xem tác động tới mục tiêu &quot;Hè châu Âu&quot;, hay cùng tìm thêm khoảng 500 USD tiết kiệm
                  trong tháng này?
                </p>
              </div>
            </div>

            <div className="flex items-start justify-end gap-4">
              <div className="glass-panel max-w-[85%] rounded-2xl rounded-tr-none border border-sky-400/10 bg-sky-400/5 p-5">
                <p className="text-on-surface leading-relaxed">
                  Tuyệt vời! Hãy tập trung tiết kiệm thêm 500 USD tháng này. Những khoản nào tôi có thể cắt giảm cụ thể?
                </p>
              </div>
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
                <img alt="" className="h-full w-full object-cover" src={userAvatarImg} />
              </div>
            </div>

            <div className="flex max-w-[85%] items-start gap-4">
              <AiAvatar />
              <div className="glass-elevated w-full rounded-2xl rounded-tl-none border border-sky-400/20 p-5 shadow-xl">
                <p className="text-on-surface mb-4">
                  Dựa trên gói đăng ký định kỳ và chi phí tiện ích biến đổi, mình tìm thấy ba cơ hội:
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/5 p-3 text-left transition-colors hover:border-primary/30"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                        subscriptions
                      </span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">-$85/th</span>
                    </div>
                    <h4 className="text-sm font-semibold">Đăng ký không dùng</h4>
                    <p className="text-on-surface-variant mt-1 text-xs">Phát hiện 3 ứng dụng bạn chưa mở trong 90 ngày.</p>
                  </button>
                  <button
                    type="button"
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/5 p-3 text-left transition-colors hover:border-primary/30"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="material-symbols-outlined text-tertiary transition-transform group-hover:scale-110">
                        bolt
                      </span>
                      <span className="rounded bg-tertiary/10 px-2 py-0.5 text-xs font-bold text-tertiary">-$42/th</span>
                    </div>
                    <h4 className="text-sm font-semibold">Tối ưu điện năng</h4>
                    <p className="text-on-surface-variant mt-1 text-xs">Chuyển sạc thiết bị sang khung giờ giá đêm.</p>
                  </button>
                </div>
                <p className="text-on-surface-variant mt-4 text-sm italic">
                  Bạn có muốn mình lập bảng chi tiết phần 373 USD tiết kiệm tiềm năng còn lại không?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-sky-400/10 bg-background/80 px-6 pb-6 pt-4 backdrop-blur-md md:px-8">
          <div className="scrollbar-hide mx-auto mb-6 flex max-w-5xl gap-3 overflow-x-auto pb-2">
            {SUGGESTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setDraft(label)}
                className="glass-panel shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>
          <form
            className="relative mx-auto max-w-5xl"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft('');
            }}
          >
            <input
              className="text-on-surface placeholder:text-slate-500 w-full rounded-2xl border border-sky-400/20 bg-surface-container-highest/40 py-4 pl-6 pr-28 backdrop-blur-lg focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Hỏi FinMind AI bất cứ điều gì về tài chính của bạn…"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-2">
              <button type="button" className="p-2 text-slate-400 transition-colors hover:text-primary" aria-label="Đính kèm">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                type="submit"
                className="text-on-primary bg-primary rounded-xl p-2 shadow-[0_0_15px_rgba(125,211,252,0.4)] transition-transform active:scale-90"
                aria-label="Gửi"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Panel ngữ cảnh — desktop */}
      <aside className="scrollbar-hide hidden w-80 shrink-0 overflow-y-auto border-t border-sky-400/10 bg-slate-950/40 p-6 font-inter backdrop-blur-md lg:block lg:border-l lg:border-t-0">
        <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">Ngữ cảnh hội thoại</h3>

        <div className="mb-10 space-y-4">
          <div className="glass-panel rounded-xl p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-on-surface-variant text-xs">Tổng số dư</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">+2.4%</span>
            </div>
            <p className="text-on-surface text-xl font-bold">$142,500.80</p>
          </div>
          <div className="glass-panel rounded-xl border-l-2 border-l-tertiary p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-on-surface-variant text-xs">Thặng dư tháng</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-tertiary">Mục: $2.5k</span>
            </div>
            <p className="text-on-surface text-xl font-bold">$1,840.00</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full w-[74%] rounded-full bg-tertiary shadow-[0_0_8px_rgba(200,160,240,0.5)]"
                role="presentation"
              />
            </div>
          </div>
        </div>

        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Mục tiêu đang chạy</h3>
        <div className="space-y-3">
          <div className="group cursor-pointer">
            <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
              <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl">flight</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold">Hè châu Âu</h4>
                <p className="text-[10px] text-on-surface-variant">Đạt 65% · $12,000</p>
              </div>
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
              <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-lg text-tertiary">
                <span className="material-symbols-outlined text-xl">home</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold">Trả trước nhà</h4>
                <p className="text-[10px] text-on-surface-variant">Đạt 12% · $80,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Insight</span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface">
            Gói <span className="font-bold text-primary">Netflix</span> premium của bạn tăng $3.00 hôm nay. Mình đang đánh
            giá lại mức cần thiết dựa trên ~2 giờ sử dụng mỗi tháng.
          </p>
        </div>
      </aside>
    </div>
  );
}
