import { useState, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

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

const TABLE_ROWS: TxRow[] = [
  {
    id: '1',
    dateLine: 'Oct 24, 2023',
    time: '14:32 PM',
    title: 'Apple Store - iPhone 15 Pro',
    category: 'Electronics',
    amount: '-$1,250.00',
    amountNote: 'Fee: $0.00',
    negative: true,
    status: 'completed',
    icon: 'shopping_bag',
    iconCellClass: 'rounded-xl border border-sky-400/10 bg-slate-800 text-sky-300',
    method: { type: 'card', label: 'Visa •••• 4242' },
  },
  {
    id: '2',
    dateLine: 'Oct 22, 2023',
    time: '09:15 AM',
    title: 'Salary Deposit - ACME Corp',
    category: 'Monthly Income',
    amount: '+$4,500.00',
    amountNote: 'Tax inclusive',
    negative: false,
    status: 'completed',
    icon: 'payments',
    iconCellClass: 'rounded-xl border border-sky-400/10 bg-sky-400/10 text-sky-300',
    method: { type: 'bank', label: 'Direct Deposit' },
  },
  {
    id: '3',
    dateLine: 'Oct 21, 2023',
    time: '19:45 PM',
    title: 'The Blue Lobster',
    category: 'Dining',
    amount: '-$245.80',
    amountNote: 'Incl. 15% Tip',
    negative: true,
    status: 'pending',
    icon: 'restaurant',
    iconCellClass: 'rounded-xl border border-sky-400/10 bg-slate-800 text-sky-300',
    method: { type: 'card', label: 'Mastercard •••• 88' },
  },
];

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
          <div className="mb-1 text-3xl font-bold text-white">$4,820.50</div>
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
          <div className="mb-1 text-3xl font-bold text-white">$1,250.00</div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-lg border border-sky-400/10 bg-white/5 px-2 py-0.5 font-medium tracking-tight text-sky-300">
              Apple Store
            </span>
            <span>Electronics</span>
          </div>
        </TxGlass>
        <TxGlass className="group relative overflow-hidden p-6">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <span className="material-symbols-outlined text-5xl">savings</span>
          </div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Cash Flow Surplus</div>
          <div className="mb-1 text-3xl font-bold text-sky-300">+$2,140.20</div>
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
              {TABLE_ROWS.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </TxGlass>

      <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Showing <span className="text-sky-300">1 to 10</span> of 248 transactions
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
