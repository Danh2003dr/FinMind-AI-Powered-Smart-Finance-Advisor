import { Link } from 'react-router-dom';

const bentoImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAAqruTq95aHHCWFEIAnYHYTbKJ3Hq4TUEKx5NSdgRCYe2ClWNkqK2xFhXsrJXATJS8iQVLGEJaIsiss3V8mJ7TF-i66WqKOtlT9nQvtgwDTUBINUqGQiX8_jp5uEonTgefGkCI6ok6gKHjZzz33xeD8CQojY_oyJEtZ17c0Qp_femafC5alf2KlQgipKBFnBXIXenAc1OjpRB2adNlR-ALAlRyDglMFg0o5163o74BlGT4RruBB_Duq92mout_EuS6TY8S9LVYkX0e';

type Accent = 'primary' | 'tertiary' | 'secondary';

type GoalDef = {
  id: string;
  accent: Accent;
  icon: string;
  badge: string;
  badgeClass: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  progressPct: number;
  progressRight: string;
  progressBarClass: string;
  barShadow?: string;
  hoverBorder: string;
  sparkHeights: string[];
  sparkAccent: 'primary' | 'tertiary' | 'secondary';
};

const GOALS: GoalDef[] = [
  {
    id: 'car',
    accent: 'primary',
    icon: 'directions_car',
    badge: 'Ưu tiên cao',
    badgeClass: 'text-primary bg-primary/10',
    dateLabel: 'Dự kiến: 20/08/2024',
    title: 'Mua xe',
    subtitle: 'VinFast VF8 - Eco Blue Edition',
    progressPct: 65,
    progressRight: '780.000.000 / 1.2B',
    progressBarClass: 'bg-primary progress-glow',
    hoverBorder: 'hover:border-primary/40',
    sparkHeights: ['h-3', 'h-5', 'h-4', 'h-7', 'h-6'],
    sparkAccent: 'primary',
  },
  {
    id: 'emergency',
    accent: 'tertiary',
    icon: 'emergency',
    badge: 'An toàn',
    badgeClass: 'text-tertiary bg-tertiary/10',
    dateLabel: 'Dự kiến: 15/06/2024',
    title: 'Quỹ khẩn cấp',
    subtitle: 'Dự phòng chi phí sinh hoạt 6 tháng',
    progressPct: 92,
    progressRight: '276.000.000 / 300M',
    progressBarClass: 'bg-tertiary',
    barShadow: 'shadow-[0_0_15px_rgba(200,160,240,0.3)]',
    hoverBorder: 'hover:border-tertiary/40',
    sparkHeights: ['h-6', 'h-7', 'h-8', 'h-6', 'h-7'],
    sparkAccent: 'tertiary',
  },
  {
    id: 'travel',
    accent: 'secondary',
    icon: 'flight_takeoff',
    badge: 'Phong cách sống',
    badgeClass: 'text-secondary bg-secondary/10',
    dateLabel: 'Dự kiến: 12/12/2024',
    title: 'Du lịch',
    subtitle: 'Khám phá Tokyo & Kyoto - Nhật Bản',
    progressPct: 15,
    progressRight: '22.500.000 / 150M',
    progressBarClass: 'bg-secondary',
    hoverBorder: 'hover:border-primary/40',
    sparkHeights: ['h-2', 'h-3', 'h-5', 'h-4', 'h-6'],
    sparkAccent: 'secondary',
  },
];

function sparkBarClass(i: number, total: number, accent: GoalDef['sparkAccent'], heights: string[]) {
  const h = heights[i] ?? 'h-4';
  const isLast = i === total - 1;
  if (accent === 'primary') {
    if (i === 3)
      return `w-1.5 ${h} rounded-full bg-primary shadow-[0_0_8px_rgba(125,211,252,0.4)]`;
    if (i === 4) return `w-1.5 ${h} rounded-full bg-primary/60`;
    return `w-1.5 ${h} rounded-full bg-primary/30`;
  }
  if (accent === 'tertiary') {
    if (i === 2)
      return `w-1.5 ${h} rounded-full bg-tertiary shadow-[0_0_8px_rgba(200,160,240,0.4)]`;
    if (i >= 3) return `w-1.5 ${h} rounded-full ${i === 3 ? 'bg-tertiary/60' : 'bg-tertiary/40'}`;
    return `w-1.5 ${h} rounded-full bg-tertiary`;
  }
  if (isLast) return `w-1.5 ${h} rounded-full bg-secondary shadow-[0_0_8px_rgba(136,180,204,0.4)]`;
  const opacities = ['bg-secondary/20', 'bg-secondary/30', 'bg-secondary/40', 'bg-secondary/60'];
  return `w-1.5 ${h} rounded-full ${opacities[i] ?? 'bg-secondary/40'}`;
}

function GoalCard({ goal }: { goal: GoalDef }) {
  const iconWrap =
    goal.accent === 'primary'
      ? 'rounded-2xl border border-primary/20 bg-primary/10'
      : goal.accent === 'tertiary'
        ? 'rounded-2xl border border-tertiary/20 bg-tertiary/10'
        : 'rounded-2xl border border-secondary/20 bg-secondary/10';

  const iconColor =
    goal.accent === 'primary' ? 'text-primary' : goal.accent === 'tertiary' ? 'text-tertiary' : 'text-secondary';

  const amountColor =
    goal.accent === 'primary' ? 'text-primary' : goal.accent === 'tertiary' ? 'text-tertiary' : 'text-secondary';

  return (
    <div
      className={`glass-card-elevated flex flex-col rounded-3xl p-6 transition-all duration-300 ${goal.hoverBorder}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className={`flex h-14 w-14 items-center justify-center ${iconWrap}`}>
          <span className={`material-symbols-outlined text-3xl ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {goal.icon}
          </span>
        </div>
        <div className="text-right">
          <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${goal.badgeClass}`}>
            {goal.badge}
          </span>
          <p className="text-on-surface-variant mt-2 text-xs">{goal.dateLabel}</p>
        </div>
      </div>
      <h4 className="text-on-surface mb-1 text-xl font-bold">{goal.title}</h4>
      <p className="text-on-surface-variant mb-6 text-sm">{goal.subtitle}</p>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">
            Tiến độ: <span className="text-on-surface font-bold">{goal.progressPct}%</span>
          </span>
          <span className={`text-on-surface font-semibold ${amountColor}`}>{goal.progressRight}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-white/5 bg-white/5">
          <div
            className={`h-full rounded-full ${goal.progressBarClass} ${goal.barShadow ?? ''}`}
            style={{ width: `${goal.progressPct}%` }}
          />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
            Tốc độ tháng này
          </span>
          <div className="mt-1 flex h-8 items-end gap-1">
            {goal.sparkHeights.map((_, i) => (
              <div
                key={i}
                className={sparkBarClass(i, goal.sparkHeights.length, goal.sparkAccent, goal.sparkHeights)}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
          aria-label="Chi tiết"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

const ACTIVITY = [
  {
    id: '1',
    icon: 'add',
    iconWrap: 'bg-emerald-400/10 text-emerald-400',
    title: "Đã gửi vào 'Mua xe'",
    meta: 'Hôm nay, 14:20 • Từ Tài khoản Chính',
    right: { type: 'amount' as const, value: '+5.000.000', sub: 'Tăng 0.41% tiến độ' },
  },
  {
    id: '2',
    icon: 'add',
    iconWrap: 'bg-emerald-400/10 text-emerald-400',
    title: 'Tiết kiệm tự động (Auto-Save)',
    meta: 'Hôm qua, 09:00 • Phân bổ đều các mục tiêu',
    right: { type: 'amount' as const, value: '+1.200.000', sub: 'AI Optimized' },
  },
  {
    id: '3',
    icon: 'flag',
    iconWrap: 'bg-primary/10 text-primary',
    title: 'Thành tích: Sẵn sàng quỹ 3 tháng',
    meta: '2 ngày trước • Quỹ khẩn cấp',
    right: { type: 'stars' as const },
  },
];

export function SavingGoalsPage() {
  return (
    <div className="font-inter text-on-surface relative w-full min-w-0 pb-20 md:pb-8">
      <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-on-surface mb-2 text-3xl font-extrabold tracking-tight">Mục tiêu Tiết kiệm</h2>
          <p className="text-on-surface-variant">
            Quản lý và theo dõi lộ trình tài chính của bạn với FinMind.
          </p>
        </div>
        <button
          type="button"
          className="border-primary/30 bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Thêm Mục tiêu
        </button>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10" />
          <p className="text-on-surface-variant mb-1 text-sm font-medium">Tổng tiết kiệm</p>
          <h3 className="text-on-surface text-2xl font-bold">
            1.240.000.000{' '}
            <span className="ml-1 text-xs font-normal uppercase tracking-wider text-primary">VND</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12% so với tháng trước</span>
          </div>
        </div>
        <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-tertiary/5 blur-3xl transition-colors group-hover:bg-tertiary/10" />
          <p className="text-on-surface-variant mb-1 text-sm font-medium">Mục tiêu đang thực hiện</p>
          <h3 className="text-on-surface text-2xl font-bold">08</h3>
          <div className="text-on-surface-variant mt-4 flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-sm">flag</span>
            <span>2 mục tiêu sắp hoàn thành</span>
          </div>
        </div>
        <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-sky-400/5 blur-3xl transition-colors group-hover:bg-sky-400/10" />
          <p className="text-on-surface-variant mb-1 text-sm font-medium">Dự kiến hoàn thành sớm</p>
          <h3 className="text-on-surface text-2xl font-bold">
            15{' '}
            <span className="text-on-surface-variant ml-1 text-xs font-normal uppercase tracking-wider">Tháng 12</span>
          </h3>
          <div className="text-primary mt-4 flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Phân tích bởi FinMind AI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {GOALS.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}

        <div className="glass-card border-primary/20 from-surface to-surface-container-high relative flex flex-col items-center gap-8 rounded-3xl border bg-gradient-to-br p-8 md:flex-row lg:col-span-2 xl:col-span-3">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Gợi ý từ FinMind AI</span>
            </div>
            <h3 className="text-on-surface mb-4 text-2xl font-bold">Tăng tốc cho &apos;Quỹ khẩn cấp&apos; của bạn</h3>
            <p className="text-on-surface-variant mb-6 max-w-xl leading-relaxed">
              Dựa trên lịch sử thu nhập và chi tiêu 3 tháng qua, bạn có thể hoàn thành mục tiêu này sớm hơn 24 ngày
              bằng cách tối ưu hóa các khoản phí không cố định. FinMind AI đã lập sẵn lộ trình chi tiết.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/ai-advisor"
                className="text-on-primary bg-primary rounded-xl px-6 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Xem lộ trình tối ưu
              </Link>
              <button
                type="button"
                className="text-on-surface rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition-all hover:bg-white/10"
              >
                Để sau
              </button>
            </div>
          </div>
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 md:aspect-square md:w-1/3">
            <img
              alt=""
              className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0"
              src={bentoImg}
            />
            <div className="from-surface absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-on-surface flex items-center gap-2 text-lg font-bold">
            <span className="material-symbols-outlined text-primary">history</span>
            Hoạt động tiết kiệm gần đây
          </h3>
          <Link to="/transactions" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả lịch sử
          </Link>
        </div>
        <div className="glass-card divide-y divide-white/5 overflow-hidden rounded-2xl">
          {ACTIVITY.map((row) => (
            <div
              key={row.id}
              className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${row.iconWrap}`}
                >
                  <span className="material-symbols-outlined text-sm">{row.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{row.title}</p>
                  <p className="text-on-surface-variant text-[10px] uppercase tracking-tighter">{row.meta}</p>
                </div>
              </div>
              <div className="text-right">
                {row.right.type === 'amount' ? (
                  <>
                    <p className="text-sm font-bold text-emerald-400">
                      {row.right.value}{' '}
                      <span className="text-[8px] uppercase tracking-wider">VND</span>
                    </p>
                    <p className="text-on-surface-variant text-[10px]">{row.right.sub}</p>
                  </>
                ) : (
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/ai-advisor"
        className="text-on-primary bg-primary fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-primary/40 transition-all hover:scale-110 active:scale-95 md:right-8"
        aria-label="Mở FinMind AI"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </Link>
    </div>
  );
}
