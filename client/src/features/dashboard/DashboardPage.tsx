import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../../api/finance';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';

function txIcon(category?: string) {
  const c = (category ?? '').toLowerCase();
  if (c.includes('ăn') || c.includes('food')) return 'restaurant';
  if (c.includes('thu')) return 'payments';
  if (c.includes('đi ') || c.includes('grab')) return 'commute';
  return 'shopping_bag';
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isPending, isError } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
  });

  const displayCurrency = 'USD';

  return (
    <div className="relative pb-20">
      <div className="mb-10 flex flex-col justify-end gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-on-surface mb-1 text-3xl font-bold tracking-tight">Financial Overview</h2>
          <p className="text-on-surface-variant">
            Xin chào, <span className="text-on-surface font-medium">{user?.name ?? 'bạn'}</span>. Dữ liệu
            dưới đây lấy từ API (tháng hiện tại).
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="border-outline-variant bg-surface-container-high text-on-surface hover:border-primary/40 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
          >
            Download Report
          </button>
          <button
            type="button"
            className="text-on-primary bg-primary hover:brightness-110 rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-95"
          >
            Quick Transfer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-rows-3 gap-6 lg:col-span-4">
          <div className="glass-panel group relative flex flex-col justify-between overflow-hidden rounded-xl p-6">
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
            <div>
              <p className="text-on-surface-variant mb-1 text-xs font-medium uppercase tracking-wider">
                Current Balance
              </p>
              <h3 className="text-primary text-glow text-4xl font-bold tracking-tight">
                {isPending
                  ? '…'
                  : isError
                    ? '—'
                    : formatCurrency(data?.currentBalance ?? 0, displayCurrency, 'en-US')}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              <span className="text-primary text-xs font-medium">Tổng số dư tài khoản</span>
            </div>
          </div>

          <div className="glass-panel flex flex-col justify-between rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-on-surface-variant mb-1 text-xs font-medium uppercase tracking-wider">
                  Total Income
                </p>
                <h3 className="text-on-surface text-2xl font-semibold">
                  {isPending
                    ? '…'
                    : formatCurrency(data?.totalIncome ?? 0, displayCurrency, 'en-US')}
                </h3>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <span className="material-symbols-outlined text-primary">arrow_downward</span>
              </div>
            </div>
            <div className="bg-surface-container-highest mt-4 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-3/4 rounded-full" />
            </div>
          </div>

          <div className="glass-panel flex flex-col justify-between rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-on-surface-variant mb-1 text-xs font-medium uppercase tracking-wider">
                  Total Expenses
                </p>
                <h3 className="text-on-surface text-2xl font-semibold">
                  {isPending
                    ? '…'
                    : formatCurrency(data?.totalExpense ?? 0, displayCurrency, 'en-US')}
                </h3>
              </div>
              <div className="rounded-lg bg-tertiary/10 p-2">
                <span className="material-symbols-outlined text-tertiary">arrow_upward</span>
              </div>
            </div>
            <div className="bg-surface-container-highest mt-4 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-tertiary h-full w-1/2 rounded-full" />
            </div>
          </div>
        </div>

        <div className="glass-panel col-span-12 min-h-[400px] rounded-xl p-6 lg:col-span-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-lg font-semibold">Cash Flow Trend</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-3 w-3 rounded-full" />
                <span className="text-on-surface-variant text-xs">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-tertiary h-3 w-3 rounded-full" />
                <span className="text-on-surface-variant text-xs">Expenses</span>
              </div>
              <select className="cursor-pointer border-none bg-transparent text-xs font-medium text-primary focus:ring-0">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
          <div className="relative mt-4 h-64 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="grad-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(125,211,252,0.2)" stopOpacity={1} />
                  <stop offset="100%" stopColor="rgba(125,211,252,0)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <line x1="0" x2="800" y1="50" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" x2="800" y1="100" y2="100" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" x2="800" y1="150" y2="150" stroke="rgba(255,255,255,0.05)" />
              <path
                d="M0,180 L100,160 L200,140 L300,150 L400,120 L500,90 L600,110 L700,70 L800,85 V200 H0 Z"
                fill="url(#grad-primary)"
              />
              <path
                d="M0,180 L100,160 L200,140 L300,150 L400,120 L500,90 L600,110 L700,70 L800,85"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <path
                d="M0,190 L100,185 L200,170 L300,175 L400,160 L500,165 L600,155 L700,160 L800,145"
                fill="none"
                stroke="#c8a0f0"
                strokeWidth={3}
                strokeDasharray="8,4"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-on-surface-variant mt-4 flex justify-between text-[10px] font-medium">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
            </div>
          </div>
        </div>

        <div className="glass-panel col-span-12 rounded-xl p-6 lg:col-span-4">
          <h4 className="mb-6 text-lg font-semibold">Expenditure Allocation</h4>
          <div className="flex flex-col items-center">
            <div className="relative mb-6 h-48 w-48">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#7dd3fc"
                  strokeDasharray="50 100"
                  strokeDashoffset="0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#c8a0f0"
                  strokeDasharray="30 100"
                  strokeDashoffset="-50"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#2a4a5e"
                  strokeDasharray="20 100"
                  strokeDashoffset="-80"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">$8.4k</span>
                <span className="text-on-surface-variant text-[10px] uppercase">Total Out</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary h-2 w-2 rounded-full" />
                  <span className="text-on-surface-variant">Housing</span>
                </div>
                <span className="font-medium">$4,200</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-tertiary h-2 w-2 rounded-full" />
                  <span className="text-on-surface-variant">Food</span>
                </div>
                <span className="font-medium">$2,550</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-on-secondary-fixed-variant h-2 w-2 rounded-full" />
                  <span className="text-on-surface-variant">Entertainment</span>
                </div>
                <span className="font-medium">$1,700</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel col-span-12 rounded-xl p-6 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-lg font-semibold">Recent Transactions</h4>
            <Link to="/transactions" className="text-primary text-xs font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isPending ? (
              <p className="text-on-surface-variant text-sm">Đang tải…</p>
            ) : isError ? (
              <p className="text-error text-sm">Không tải được dữ liệu.</p>
            ) : (data?.recentTransactions?.length ?? 0) === 0 ? (
              <p className="text-on-surface-variant text-sm">Chưa có giao dịch. Thêm tại mục Giao dịch.</p>
            ) : (
              data!.recentTransactions.map((row) => {
                const neg = row.amount < 0;
                const cur = row.currency || displayCurrency;
                const meta = `${row.category ?? 'Không phân loại'} • ${new Date(row.occurredAt).toLocaleDateString('vi-VN')}`;
                return (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-surface-container-high flex h-10 w-10 items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-primary">{txIcon(row.category)}</span>
                      </div>
                      <div>
                        <p className="text-on-surface text-sm font-medium">{row.description}</p>
                        <p className="text-on-surface-variant text-[10px]">{meta}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${neg ? 'text-error' : 'text-primary'}`}
                    >
                      {neg ? '' : '+'}
                      {formatCurrency(row.amount, cur, cur === 'VND' ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
          <div className="glass-panel-elevated border-primary/30 group relative rounded-xl p-6 shadow-[0_0_30px_rgba(125,211,252,0.1)]">
            <div className="absolute -right-3 -top-3">
              <div className="text-on-primary bg-primary flex h-8 w-8 items-center justify-center rounded-full shadow-lg shadow-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
            </div>
            <h5 className="text-primary mb-3 text-sm font-bold uppercase tracking-tighter">AI Insight</h5>
            <p className="text-on-surface text-sm leading-relaxed">
              &quot;You spent <span className="text-primary font-bold">20% of your salary</span> on coffee this
              week. Switching to a subscription could save you{' '}
              <span className="text-primary font-bold">$120/month</span>.&quot;
            </p>
            <div className="mt-4 border-t border-white/5 pt-4">
              <Link
                to="/ai-advisor"
                className="text-primary flex items-center gap-1 text-xs font-semibold transition-colors hover:text-sky-200"
              >
                Explore Savings Plans
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h5 className="text-on-surface-variant mb-4 text-xs font-bold uppercase">Live Market</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">S&amp;P 500</span>
                <span className="text-primary text-xs">+1.24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Bitcoin (BTC)</span>
                <span className="text-error text-xs">-0.45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Ethereum (ETH)</span>
                <span className="text-primary text-xs">+2.10%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel from-primary/5 rounded-xl bg-gradient-to-br to-transparent p-5">
            <h5 className="text-on-surface-variant mb-3 text-xs font-bold uppercase">Health Score</h5>
            <div className="flex items-center gap-3">
              <span className="text-primary text-3xl font-bold">88</span>
              <div className="text-on-surface-variant text-[10px] leading-tight">
                Excellent performance.
                <br />
                Diversification is optimal.
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="text-on-primary bg-primary fixed bottom-8 right-8 z-50 hidden h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-primary/40 transition-all hover:scale-110 active:scale-95 sm:flex"
        aria-label="Thêm nhanh"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}
