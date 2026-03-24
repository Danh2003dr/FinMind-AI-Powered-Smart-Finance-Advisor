import { useMemo, useState, type HTMLAttributes } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTransactions, type TransactionDto } from '../../api/finance';
import { formatCurrency } from '../../utils/formatCurrency';

type TxStatus = 'completed' | 'pending';

type TxRow = {
  id: string;
  dateLine: string;
  time: string;
  title: string;
  category: string;
  amount: string;
  amountNote: string;
  negative: boolean;
  status: TxStatus;
  icon: string;
  iconCellClass: string;
  method: { type: 'card' | 'bank'; label: string };
};

function mapTransaction(t: TransactionDto): TxRow {
  const d = new Date(t.occurredAt);
  const negative = t.amount < 0;
  const cur = t.currency || 'USD';
  const loc = cur === 'VND' ? 'vi-VN' : 'en-US';
  const cat = (t.category ?? '').toLowerCase();
  let icon = 'shopping_bag';
  let iconCellClass = 'rounded-xl border border-sky-400/10 bg-slate-800 text-sky-300';
  if (cat.includes('thu') || t.amount > 0) {
    icon = 'payments';
    iconCellClass = 'rounded-xl border border-sky-400/10 bg-sky-400/10 text-sky-300';
  } else if (cat.includes('ăn') || cat.includes('food')) {
    icon = 'restaurant';
  }
  const sign = negative ? '-' : '+';
  const absAmt = formatCurrency(Math.abs(t.amount), cur, loc);
  return {
    id: t.id,
    dateLine: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    title: t.description,
    category: t.category ?? '—',
    amount: `${sign}${absAmt}`,
    amountNote: negative ? 'Chi tiêu' : 'Thu nhập',
    negative,
    status: t.status === 'pending' ? 'pending' : 'completed',
    icon,
    iconCellClass,
    method: {
      type: t.methodType === 'bank' ? 'bank' : 'card',
      label: t.methodLabel ?? '—',
    },
  };
}

function MethodCell({ method }: { method: TxRow['method'] }) {
  const icon = method.type === 'card' ? 'credit_card' : 'account_balance';
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-lg text-slate-500">{icon}</span>
      <span className="text-xs text-slate-300">{method.label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: TxStatus }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
      Completed
    </span>
  );
}

/** Khối kính kiểu mock (slate + blur + viền sky) */
function TxGlass({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-sky-400/10 bg-slate-800/40 backdrop-blur-xl ${className}`}
      {...props}
    />
  );
}

export function TransactionsPage() {
  const [keyword, setKeyword] = useState('');
  const { data: raw = [], isPending, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
  });

  const rows = useMemo(() => {
    const mapped = raw.map(mapTransaction);
    const k = keyword.trim().toLowerCase();
    if (!k) return mapped;
    return mapped.filter(
      (r) =>
        r.title.toLowerCase().includes(k) ||
        r.category.toLowerCase().includes(k),
    );
  }, [raw, keyword]);

  const monthSpend = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    let s = 0;
    let max = 0;
    let maxTitle = '—';
    for (const t of raw) {
      const d = new Date(t.occurredAt);
      if (d < start) continue;
      if (t.amount < 0) {
        s += Math.abs(t.amount);
        if (Math.abs(t.amount) > max) {
          max = Math.abs(t.amount);
          maxTitle = t.description;
        }
      }
    }
    return { spend: s, largest: max, largestTitle: maxTitle };
  }, [raw]);

  const surplus = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    let inc = 0;
    let exp = 0;
    for (const t of raw) {
      const d = new Date(t.occurredAt);
      if (d < start) continue;
      if (t.amount >= 0) inc += t.amount;
      else exp += Math.abs(t.amount);
    }
    return inc - exp;
  }, [raw]);

  return (
    <div className="font-inter text-on-surface w-full min-w-0">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Finances</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-sky-300">Transaction History</span>
          </nav>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Transaction History</h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            Review and manage your financial activity across all accounts.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3 md:justify-end">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-sky-400/10 bg-slate-800/50 px-4 py-2 text-xs font-semibold transition-all hover:bg-slate-700/50 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
          <Link
            to="/transactions/scan"
            className="flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold text-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.1)] transition-all hover:bg-sky-400/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Transaction
          </Link>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <TxGlass className="group relative overflow-hidden p-6">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <span className="material-symbols-outlined text-5xl">payments</span>
          </div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Monthly Spend</div>
          <div className="mb-1 text-3xl font-bold text-white">
            {isPending ? '…' : formatCurrency(monthSpend.spend, 'USD', 'en-US')}
          </div>
          <div className="text-error flex items-center gap-1 text-xs font-medium">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>12% from last month</span>
          </div>
        </TxGlass>
        <TxGlass className="group relative overflow-hidden p-6">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <span className="material-symbols-outlined text-5xl">shopping_cart</span>
          </div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Largest Transaction</div>
          <div className="mb-1 text-3xl font-bold text-white">
            {isPending ? '…' : formatCurrency(monthSpend.largest, 'USD', 'en-US')}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-lg border border-sky-400/10 bg-white/5 px-2 py-0.5 font-medium tracking-tight text-sky-300">
              {monthSpend.largestTitle}
            </span>
            <span>Tháng này</span>
          </div>
        </TxGlass>
        <TxGlass className="group relative overflow-hidden p-6">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <span className="material-symbols-outlined text-5xl">savings</span>
          </div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Cash Flow Surplus</div>
          <div className="mb-1 text-3xl font-bold text-sky-300">
            {isPending ? '…' : `${surplus >= 0 ? '+' : ''}${formatCurrency(surplus, 'USD', 'en-US')}`}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-sky-300">
            <span className="material-symbols-outlined text-sm">trending_down</span>
            <span>Spend decreased by 4%</span>
          </div>
        </TxGlass>
      </div>

      <TxGlass className="mb-8 p-6">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Keyword Search
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input
                className="placeholder:text-slate-600 w-full rounded-xl border border-sky-400/10 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-on-surface transition-all focus:outline-none focus:ring-1 focus:ring-sky-400"
                placeholder="Search by description or merchant..."
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Date Range
            </label>
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-sky-400/10 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-slate-500">calendar_today</span>
                <span>Oct 01 - Oct 31</span>
              </div>
              <span className="material-symbols-outlined text-lg text-slate-500">expand_more</span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Category
            </label>
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-sky-400/10 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-slate-500">category</span>
                <span>All</span>
              </div>
              <span className="material-symbols-outlined text-lg text-slate-500">expand_more</span>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-6 py-2.5 text-sm font-bold text-sky-300 transition-all hover:bg-sky-400/20 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Apply
            </button>
          </div>
        </div>
      </TxGlass>

      <TxGlass className="mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-sky-400/10 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Description / Category
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Method</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-400/5">
              {isPending ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Đang tải…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-error">
                    Không tải được giao dịch.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Chưa có giao dịch. Đăng ký tài khoản mới sẽ có danh mục mặc định — thêm giao dịch qua API hoặc
                    tính năng (sắp tới).
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-sky-400/[0.03]">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-white">{row.dateLine}</div>
                    <div className="text-[10px] text-slate-500">{row.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center ${row.iconCellClass}`}
                      >
                        <span className="material-symbols-outlined">{row.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{row.title}</div>
                        <div className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                          {row.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-bold ${row.negative ? 'text-error' : 'text-sky-300'}`}>
                      {row.amount}
                    </div>
                    <div className="text-[10px] font-medium text-slate-600">{row.amountNote}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <MethodCell method={row.method} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="p-1 text-slate-600 transition-colors hover:text-sky-300"
                      aria-label="More"
                    >
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TxGlass>

      <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Hiển thị <span className="text-sky-300">{rows.length}</span> giao dịch
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="rounded-xl border border-sky-400/10 bg-slate-800/50 p-2 transition-all hover:bg-sky-400/10 active:scale-95 disabled:opacity-30"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-xl bg-sky-400 text-xs font-bold text-slate-950 shadow-lg shadow-sky-400/20"
          >
            1
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-sky-400/10 bg-slate-800/50 text-xs font-bold text-slate-400 transition-all hover:bg-sky-400/10 active:scale-95"
          >
            2
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-sky-400/10 bg-slate-800/50 text-xs font-bold text-slate-400 transition-all hover:bg-sky-400/10 active:scale-95"
          >
            3
          </button>
          <span className="px-1 text-xs text-slate-700">•••</span>
          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-sky-400/10 bg-slate-800/50 text-xs font-bold text-slate-400 transition-all hover:bg-sky-400/10 active:scale-95"
          >
            25
          </button>
          <button
            type="button"
            className="rounded-xl border border-sky-400/10 bg-slate-800/50 p-2 transition-all hover:bg-sky-400/10 active:scale-95"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
