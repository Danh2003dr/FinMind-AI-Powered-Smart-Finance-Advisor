import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBudgets, type BudgetDto } from '../../api/finance';
import { formatCurrency } from '../../utils/formatCurrency';

type CategoryTone = 'sky' | 'tertiary';
type StatusKind = 'error' | 'success' | 'info' | 'critical';
type BarVariant = 'solid' | 'near-limit' | 'over-limit';

type CategoryRow = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tone: CategoryTone;
  progressPct: number;
  spentLabel: string;
  capLabel: string;
  status: { kind: StatusKind; icon: string; text: string };
  barVariant: BarVariant;
};

function mapBudgetDto(b: BudgetDto, index: number): CategoryRow {
  const cur = b.currency || 'VND';
  const loc = cur === 'VND' ? 'vi-VN' : 'en-US';
  const pct = b.progressPct;
  const tone: CategoryTone = index % 2 === 0 ? 'sky' : 'tertiary';
  let barVariant: BarVariant = 'solid';
  let status: CategoryRow['status'];
  if (pct >= 100) {
    barVariant = 'over-limit';
    status = {
      kind: 'critical',
      icon: 'error',
      text: 'Đã vượt hoặc đạt hạn mức ngân sách',
    };
  } else if (pct >= 85) {
    barVariant = 'near-limit';
    status = {
      kind: 'error',
      icon: 'warning',
      text: 'Bạn đã tiêu gần hết ngân sách danh mục này',
    };
  } else if (pct >= 50) {
    status = {
      kind: 'info',
      icon: 'info',
      text: `Đã dùng ${pct}% hạn mức`,
    };
  } else {
    status = {
      kind: 'success',
      icon: 'check_circle',
      text: 'Chi tiêu đang ở mức an toàn',
    };
  }
  return {
    id: b.id,
    title: b.name,
    subtitle: b.subtitle ?? b.categoryName ?? 'Ngân sách',
    icon: b.icon || 'category',
    tone,
    progressPct: pct,
    spentLabel: formatCurrency(b.spentAmount, cur, loc).replace(/\s/g, ''),
    capLabel: formatCurrency(b.capAmount, cur, loc),
    status,
    barVariant,
  };
}

function BudgetBarFill({ pct, variant }: { pct: number; variant: BarVariant }) {
  if (variant === 'solid') {
    return <div className="h-full rounded-full bg-sky-400" style={{ width: `${pct}%` }} />;
  }
  if (variant === 'near-limit') {
    return (
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-300 to-error shadow-[0_0_10px_rgba(255,107,107,0.3)]"
        style={{ width: `${pct}%` }}
      />
    );
  }
  return (
    <div
      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-error to-error shadow-[0_0_15px_rgba(255,107,107,0.4)]"
      style={{ width: `${pct}%` }}
    />
  );
}

const WEEKS = [
  { label: 'Tuần 1', outerH: 'h-[40%]', innerH: 'h-[70%]', ghost: false },
  { label: 'Tuần 2', outerH: 'h-[60%]', innerH: 'h-[85%]', ghost: false },
  { label: 'Tuần 3', outerH: 'h-[85%]', innerH: 'h-[95%]', ghost: false },
  { label: 'Tuần 4', outerH: 'h-[75%]', innerH: 'h-[40%]', ghost: false },
  { label: 'Dự báo', outerH: 'h-[50%]', innerH: '', ghost: true },
] as const;

function iconWrapClass(tone: CategoryTone) {
  return tone === 'sky'
    ? 'rounded-2xl border border-sky-400/20 bg-sky-400/10'
    : 'rounded-2xl border border-tertiary/20 bg-tertiary/10';
}

function iconClass(tone: CategoryTone) {
  return tone === 'sky' ? 'text-sky-300' : 'text-tertiary';
}

function statusRowClass(kind: StatusKind) {
  const base = 'flex items-center gap-2 pt-2 text-[11px]';
  if (kind === 'error') return `${base} text-error/80`;
  if (kind === 'success') return `${base} text-emerald-400/80`;
  if (kind === 'critical') return `${base} font-bold text-error`;
  return `${base} text-on-surface-variant`;
}

function CategoryCard({ row }: { row: CategoryRow }) {
  return (
    <div className="glass-elevated rounded-3xl p-6 transition-transform duration-300 hover:scale-[1.01]">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center ${iconWrapClass(row.tone)}`}>
            <span className={`material-symbols-outlined ${iconClass(row.tone)}`}>{row.icon}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-on-surface">{row.title}</h4>
            <p className="text-xs text-on-surface-variant">{row.subtitle}</p>
          </div>
        </div>
        <button type="button" className="text-on-surface-variant transition-colors hover:text-on-surface" aria-label="Tùy chọn">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Tiến độ: {row.progressPct}%</span>
          <span className="font-medium">
            {row.spentLabel} / <span className="text-on-surface-variant">{row.capLabel}</span>
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border border-white/5 bg-white/5">
          <BudgetBarFill pct={row.progressPct} variant={row.barVariant} />
        </div>
        <div className={statusRowClass(row.status.kind)}>
          <span className="material-symbols-outlined text-[14px]">{row.status.icon}</span>
          <span>{row.status.text}</span>
        </div>
      </div>
    </div>
  );
}

export function BudgetsPage() {
  const [month, setMonth] = useState('current');
  const { data: budgets = [], isPending, isError } = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  });

  const rows = useMemo(() => budgets.map((b, i) => mapBudgetDto(b, i)), [budgets]);

  const totals = useMemo(() => {
    let cap = 0;
    let spent = 0;
    const cur = budgets[0]?.currency ?? 'VND';
    for (const b of budgets) {
      cap += b.capAmount;
      spent += b.spentAmount;
    }
    const left = Math.max(0, cap - spent);
    const overallPct = cap > 0 ? Math.round((spent / cap) * 100) : 0;
    return { cap, spent, left, overallPct, cur };
  }, [budgets]);

  const loc = totals.cur === 'VND' ? 'vi-VN' : 'en-US';

  return (
    <div className="font-inter text-on-surface w-full min-w-0">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-on-surface">Quản lý Ngân sách</h1>
            <p className="text-on-surface-variant">Theo dõi và tối ưu hóa chi tiêu hàng tháng của bạn.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-panel flex items-center gap-3 rounded-xl px-4 py-2">
              <span className="material-symbols-outlined text-lg text-sky-300">calendar_month</span>
              <select
                className="cursor-pointer border-none bg-transparent text-sm text-on-surface focus:ring-0"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                aria-label="Chọn tháng"
              >
                <option value="current">Tháng 10, 2023</option>
                <option value="prev">Tháng 09, 2023</option>
                <option value="next">Tháng 08, 2023</option>
              </select>
            </div>
            <button
              type="button"
              className="text-on-primary bg-primary flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Thêm Ngân sách
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="glass-panel flex flex-col justify-between rounded-2xl p-6 md:col-span-2">
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-sky-300/60">
                Tổng ngân sách
              </span>
              <h3 className="text-3xl font-bold text-on-surface">
                {isPending ? '…' : formatCurrency(totals.cap, totals.cur, loc)}
              </h3>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-tertiary"
                  style={{ width: `${totals.overallPct}%` }}
                />
              </div>
              <span className="text-sm font-medium text-sky-300">{totals.overallPct}%</span>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Đã chi tiêu
            </span>
            <h3 className="text-2xl font-bold text-on-surface">
              {isPending ? '…' : formatCurrency(totals.spent, totals.cur, loc)}
            </h3>
            <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
              <span className="material-symbols-outlined text-xs">arrow_downward</span>
              12% so với tháng trước
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Còn lại
            </span>
            <h3 className="text-2xl font-bold text-on-surface">
              {isPending ? '…' : formatCurrency(totals.left, totals.cur, loc)}
            </h3>
            <p className="mt-2 text-xs text-on-surface-variant">Dự kiến đủ cho 12 ngày tới</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {isPending ? (
            <p className="text-on-surface-variant col-span-2 text-center">Đang tải ngân sách…</p>
          ) : isError ? (
            <p className="text-error col-span-2 text-center">Không tải được dữ liệu.</p>
          ) : rows.length === 0 ? (
            <p className="text-on-surface-variant col-span-2 text-center">
              Chưa có ngân sách. Tạo qua API <code className="text-sky-300">POST /budgets</code> hoặc thêm form sau.
            </p>
          ) : (
            rows.map((row) => <CategoryCard key={row.id} row={row} />)
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass-panel relative flex flex-col justify-center overflow-hidden rounded-3xl p-8">
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
            <span className="material-symbols-outlined mb-4 text-4xl text-sky-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="mb-3 text-xl font-bold">AI Gợi ý</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Dựa trên dữ liệu chi tiêu tuần qua, bạn có thể tiết kiệm thêm{' '}
              <span className="font-bold text-sky-300">1.200.000đ</span> nếu giảm tần suất ăn ngoài vào cuối tuần.
            </p>
            <Link
              to="/ai-advisor"
              className="group mt-6 flex items-center gap-1 text-sm font-semibold text-sky-300"
            >
              Xem chi tiết
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="glass-panel rounded-3xl p-8 lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold">Phân tích dòng tiền</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-sky-400" />
                <span className="text-xs text-on-surface-variant">Thực tế</span>
                <span className="ml-4 inline-block h-3 w-3 rounded-full bg-white/20" />
                <span className="text-xs text-on-surface-variant">Dự kiến</span>
              </div>
            </div>
            <div className="flex h-48 items-end justify-between gap-4 px-2 pb-6">
              {WEEKS.map((w) =>
                w.ghost ? (
                  <div key={w.label} className={`relative flex-1 rounded-t-lg bg-white/5 ${w.outerH}`}>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant">
                      {w.label}
                    </span>
                  </div>
                ) : (
                  <div
                    key={w.label}
                    className={`group relative flex-1 rounded-t-lg bg-sky-400/20 ${w.outerH}`}
                  >
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg bg-sky-400 transition-all group-hover:brightness-125 ${w.innerH}`}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant">
                      {w.label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
