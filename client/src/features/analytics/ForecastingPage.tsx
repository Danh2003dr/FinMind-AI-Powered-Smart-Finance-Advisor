const meshImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCcEl86Z1f-4YHI3ZnpRXbiyQtufA-Dwd7u1A8duRK--haNuyasXkQ7-ULeum_N9Zu_yycgRmP6HXxv5vzC9CJuHIH9hefjgsQ6aWQrsKLscNnbSqOkHqjhGZUkc59l3UVCcSdUOqPwJnRABV6wxCSRj4pQDp7_K-rIqI6YtnWwinFOh5a6zE6BnnXPy-IifzNQmvpaG7QGgUt4eqvIEFn581Ag4qMXwAzc-735h6RaGYIDlN0n2T3Ssi0_Ii6YEJWGqOF2NjIlMLE4';

export function ForecastingPage() {
  return (
    <div className="font-inter text-on-background selection:bg-primary/30">
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">Predictive Intelligence Engine</span>
          </div>
          <h2 className="text-on-surface text-4xl font-extrabold tracking-tight">Financial Forecasting</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl text-lg">
            AI-powered projections for the next 90 days based on your historical spending and seasonal trends.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="glass-card border-primary/20 flex items-center gap-3 rounded-lg border px-4 py-2">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <span className="text-sm font-medium">Next 3 Months</span>
          </div>
          <button
            type="button"
            className="glass-card border-primary/20 flex items-center gap-3 rounded-lg border px-4 py-2 transition-colors hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-primary">download</span>
            <span className="text-sm font-medium">Export Forecast</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="glass-card relative flex flex-col overflow-hidden rounded-2xl p-8 lg:col-span-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-on-surface text-lg font-bold">Future Balance Projection</h3>
              <p className="text-on-surface-variant text-xs italic">94.2% AI Confidence Interval</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-3 w-3 rounded-full" />
                <span className="text-on-surface-variant text-xs">Predicted Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-tertiary h-3 w-3 rounded-full" />
                <span className="text-on-surface-variant text-xs">Predicted Expenses</span>
              </div>
            </div>
          </div>

          <div className="relative mt-4 min-h-[350px] w-full flex-1">
            <div className="pointer-events-none absolute inset-0 grid grid-rows-5 gap-0">
              <div className="border-b border-white/5" />
              <div className="border-b border-white/5" />
              <div className="border-b border-white/5" />
              <div className="border-b border-white/5" />
              <div className="border-b border-white/5" />
            </div>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fc-grad-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path
                d="M0 250 Q 150 200, 300 220 T 600 150 T 900 100 L 900 400 L 0 400 Z"
                fill="url(#fc-grad-primary)"
              />
              <path
                d="M0 300 Q 150 280, 300 320 T 600 280 T 900 350 L 900 400 L 0 400 Z"
                fill="rgba(200, 160, 240, 0.2)"
              />
              <path
                d="M0 250 Q 150 200, 300 220 T 600 150 T 900 100"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth={3}
              />
              <path
                d="M0 300 Q 150 280, 300 320 T 600 280 T 900 350"
                fill="none"
                stroke="#c8a0f0"
                strokeWidth={2}
                strokeDasharray="8 4"
              />
            </svg>
            <div className="border-primary/30 bg-primary absolute right-[5%] top-[100px] z-10 h-4 w-4 rounded-full border-2 border-white shadow-[0_0_15px_#7dd3fc]" />
            <div className="border-primary/30 bg-surface-container-highest/90 absolute right-[5%] top-[100px] z-20 translate-x-1/2 -translate-y-full rounded-lg border p-3 backdrop-blur-md">
              <p className="text-primary text-[10px] font-bold uppercase">Predicted Peak</p>
              <p className="text-lg font-black text-white">$24,500.00</p>
              <p className="text-[10px] text-slate-400">September 14, 2024</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span>Current (July)</span>
            <span>August</span>
            <span>September</span>
            <span>October (Predicted)</span>
          </div>
        </section>

        <section className="flex flex-col gap-6 lg:col-span-4">
          <div className="glass-card-elevated group relative overflow-hidden rounded-2xl p-6">
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <span className="material-symbols-outlined text-7xl text-primary">speed</span>
            </div>
            <h3 className="text-on-surface-variant mb-6 text-sm font-bold uppercase tracking-wider">
              Runway &amp; Burn Rate
            </h3>
            <div className="flex flex-col items-center py-4">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                  />
                  <circle
                    className="drop-shadow-[0_0_8px_rgba(125,211,252,0.5)]"
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#7dd3fc"
                    strokeDasharray="440"
                    strokeDashoffset="110"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-glow text-4xl font-black">7.4</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Months</span>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-slate-300">
                At current spending levels, your liquid assets will last{' '}
                <span className="text-primary font-bold">224 days</span>.
              </p>
            </div>
            <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Monthly Burn</span>
                <span className="text-sm font-bold">$3,420.50</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="from-primary/50 h-full w-3/4 rounded-full bg-gradient-to-r to-primary" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-on-surface-variant mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-error text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              Predictive Alerts
            </h3>
            <div className="space-y-3">
              <div className="border-error/20 bg-error-container/20 flex items-start gap-3 rounded-xl border p-3">
                <span className="material-symbols-outlined text-error mt-0.5 text-sm">trending_up</span>
                <div>
                  <p className="text-on-error-container text-xs font-bold">Grocery Spike Detected</p>
                  <p className="text-on-error-container/70 mt-1 text-[10px] leading-relaxed">
                    Historically, you spend 45% more on groceries next week due to holiday cycles.
                  </p>
                </div>
              </div>
              <div className="border-primary/20 bg-primary-container/20 flex items-start gap-3 rounded-xl border p-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-sm">subscriptions</span>
                <div>
                  <p className="text-on-primary-container text-xs font-bold">Upcoming Renewal</p>
                  <p className="text-on-primary-container/70 mt-1 text-[10px] leading-relaxed">
                    &apos;Cloud Storage Pro&apos; ($199/yr) is scheduled for Aug 12. Adjust budget?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-12">
          <h3 className="text-on-surface mb-6 flex items-center gap-2 text-xl font-bold">
            <span className="material-symbols-outlined text-tertiary">lightbulb</span>
            Optimization Suggestions
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="glass-card border-tertiary/20 group cursor-pointer rounded-2xl border p-6 transition-colors hover:border-tertiary/40">
              <div className="bg-tertiary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-tertiary">savings</span>
              </div>
              <h4 className="text-on-surface mb-2 font-bold">High-Yield Shift</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Move $4,500 of idle cash to your &apos;FinMind Prime&apos; account to earn an additional{' '}
                <span className="text-tertiary font-bold">$18.50/mo</span> in interest.
              </p>
              <button
                type="button"
                className="text-tertiary mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-all group-hover:gap-2"
              >
                Execute Strategy <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card border-primary/20 group cursor-pointer rounded-2xl border p-6 transition-colors hover:border-primary/40">
              <div className="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary">equalizer</span>
              </div>
              <h4 className="text-on-surface mb-2 font-bold">Subscription Cleanup</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                You haven&apos;t used 3 streaming services in 60 days. Canceling could save you{' '}
                <span className="text-primary font-bold">$42.99/mo</span> starting next month.
              </p>
              <button
                type="button"
                className="text-primary mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-all group-hover:gap-2"
              >
                Review Subscriptions <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card relative flex flex-col justify-center overflow-hidden rounded-2xl border border-sky-300/10 p-6">
              <div className="absolute inset-0 z-0 opacity-20">
                <img alt="" className="h-full w-full object-cover" src={meshImg} />
              </div>
              <div className="relative z-10 text-center">
                <h4 className="mb-1 text-xs font-black uppercase tracking-widest text-sky-300">Dynamic Budgeting</h4>
                <p className="text-xl font-bold text-white">Enable AI Autopilot?</p>
                <p className="mt-2 px-4 text-[10px] text-slate-400">
                  Let FinMind AI automatically move funds to hit your Q4 savings goal.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-bold backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Configure Autopilot
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sky-400/5 py-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex-row">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} FinMind</span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span>System Status: Optimal</span>
        </div>
        <div className="flex items-center gap-6">
          <a className="transition-colors hover:text-primary" href="#" onClick={(e) => e.preventDefault()}>
            Privacy Protocol
          </a>
          <a className="transition-colors hover:text-primary" href="#" onClick={(e) => e.preventDefault()}>
            API Documentation
          </a>
          <a className="transition-colors hover:text-primary" href="#" onClick={(e) => e.preventDefault()}>
            Security Audit
          </a>
        </div>
      </footer>
    </div>
  );
}
