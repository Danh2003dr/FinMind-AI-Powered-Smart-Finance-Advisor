import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { postAdvisorChat, type ChatTurn } from '../../api/advisor';

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

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const m = res?.data?.message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  if (err instanceof Error) return err.message;
  return 'Không gọi được API. Kiểm tra server và CORS.';
}

export function AIAdvisorPage() {
  const [draft, setDraft] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: postAdvisorChat,
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, mutation.isPending]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-sky-400/10 bg-slate-950/30 lg:min-h-[min(640px,calc(100dvh-8rem))] lg:max-h-[calc(100dvh-8rem)] lg:flex-row">
      {/* Khu chat */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 -translate-y-1/2 translate-x-1/4 rounded-full bg-sky-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/4 rounded-full bg-tertiary/10 blur-[120px]" />

        <div
          ref={scrollRef}
          className="scrollbar-hide flex flex-1 flex-col space-y-8 overflow-y-auto scroll-smooth px-6 py-8 md:px-8 md:py-10"
        >
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="glass-elevated ai-glow flex h-16 w-16 items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-on-surface text-2xl font-bold tracking-tight">FinMind Financial Advisor</h1>
              <p className="text-on-surface-variant text-sm">Thông minh thời gian thực cho dòng tiền của bạn (Gemini)</p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-col space-y-8">
            {turns.length === 0 && (
              <div className="flex max-w-[85%] items-start gap-4">
                <AiAvatar />
                <div className="glass-elevated rounded-2xl rounded-tl-none border border-sky-400/20 p-5 shadow-xl">
                  <p className="text-on-surface leading-relaxed">
                    Chào bạn! Hãy hỏi về ngân sách, tiết kiệm hoặc đầu tư — mình trả lời bằng Gemini khi server đã cấu hình{' '}
                    <span className="font-mono text-xs text-primary">GEMINI_API_KEY</span>.
                  </p>
                </div>
              </div>
            )}

            {turns.map((t, i) =>
              t.role === 'assistant' ? (
                <div key={`a-${i}`} className="flex max-w-[85%] items-start gap-4">
                  <AiAvatar />
                  <div className="glass-elevated rounded-2xl rounded-tl-none border border-sky-400/20 p-5 shadow-xl">
                    <p className="text-on-surface whitespace-pre-wrap leading-relaxed">{t.content}</p>
                  </div>
                </div>
              ) : (
                <div key={`u-${i}`} className="flex items-start justify-end gap-4">
                  <div className="glass-panel max-w-[85%] rounded-2xl rounded-tr-none border border-sky-400/10 bg-sky-400/5 p-5">
                    <p className="text-on-surface whitespace-pre-wrap leading-relaxed">{t.content}</p>
                  </div>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <img alt="" className="h-full w-full object-cover" src={userAvatarImg} />
                  </div>
                </div>
              ),
            )}

            {mutation.isPending && (
              <div className="flex max-w-[85%] items-start gap-4">
                <AiAvatar />
                <div className="glass-elevated rounded-2xl rounded-tl-none border border-sky-400/20 p-5 shadow-xl">
                  <p className="text-on-surface-variant text-sm italic">Đang suy nghĩ…</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-sky-400/10 bg-background/80 px-6 pb-6 pt-4 backdrop-blur-md md:px-8">
          <div className="scrollbar-hide mx-auto mb-6 flex max-w-5xl gap-3 overflow-x-auto pb-2">
            {SUGGESTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setDraft(label)}
                disabled={mutation.isPending}
                className="glass-panel shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
          <form
            className="relative mx-auto max-w-5xl"
            onSubmit={(e) => {
              e.preventDefault();
              const text = draft.trim();
              if (!text || mutation.isPending) return;
              const next: ChatTurn[] = [...turns, { role: 'user', content: text }];
              setTurns(next);
              setDraft('');
              mutation.mutate(next, {
                onSuccess: (data) => {
                  setTurns((prev) => [...prev, { role: 'assistant', content: data.reply }]);
                },
                onError: (err) => {
                  setTurns((prev) => [...prev, { role: 'assistant', content: getErrorMessage(err) }]);
                },
              });
            }}
          >
            <input
              className="text-on-surface placeholder:text-slate-500 w-full rounded-2xl border border-sky-400/20 bg-surface-container-highest/40 py-4 pl-6 pr-28 backdrop-blur-lg focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              placeholder="Hỏi FinMind AI bất cứ điều gì về tài chính của bạn…"
              type="text"
              value={draft}
              disabled={mutation.isPending}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-2">
              <button type="button" className="p-2 text-slate-400 transition-colors hover:text-primary" aria-label="Đính kèm">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !draft.trim()}
                className="text-on-primary bg-primary rounded-xl p-2 shadow-[0_0_15px_rgba(125,211,252,0.4)] transition-transform active:scale-90 disabled:opacity-50"
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
