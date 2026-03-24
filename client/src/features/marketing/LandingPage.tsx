import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const imgReceipt =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA67Mo85jV4Xz4ooVQMnC4nstJHFOb0FPb-3Htk1st5o3FAxjlB2KvCMBuj2wzcY8wub2qjW3NdzOmPGaP6vq2Sp6zjZrG3kXSG-erRUdDAfQcpfOcKCnVvNes_rPHxGMNwNvMohZFWpvvdtnhpc0iTN5ogFgAbGxnLI79Ux_SNOjtqsem_CqH_UWCUgw0IFTrasdssB4BZeOXjh5ZJMzd4QKGWf1E8vpGXtwq6oRMcZIQ_YjYWAJoYuGlwccuaEr0LIcrMix_ym_36';

const imgForecast =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBnRnG5g-C-5gZsMxq0fjWtOgfLEokAX8NcFzvoKRphSez-xHaJ7F0nAZw2IgdFMnddoi0roc5vnRVGsnGKBi9LvbwaMheyagpDtqWdybMgEdTNUAhsm1kQDaKRa-NSwKwJx0HOKj3iDkqWzFb4CaG6SSD1Qt7F2mOLqP7Rpuj5oGk7B9lGbL6GA4pU2ISctAn6ZbzmJ8hYR5EtQ4lZHnQqM9UWswwk9iIriKR-JyS5-XlhwQ6tMR61rII79dMhL_aerdr8ukUBZsA4';

const imgMarkets =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAF1eJiNCxEa6tGAyQ7LK0uZjaRaVhS9vzJsmYxqc2z_tPRqCaQrb-ifw9U8cGijEW_B2l8ouBosSM0dinQZV5mEPEJWPymXfxXgQFXIbjhWCQwQozJ4we8jLZNsubCAz58FlvQ2Tm-lZfGETRmr_rYSjh25cmbTp46p44ZUfvH3onYGN04Q1mYbDoUmbaGCuQFwpuI6TAsFx3l2avBpgbmj5GpnE0w_HDX07eOEyzHqnZtr1wbrm3kEMtr8MYo41rKOIqV51j7z4A7';

function NavLinkItem({
  children,
  href,
  active,
}: {
  children: ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`cursor-pointer transition-transform active:scale-95 ${
        active
          ? 'border-b-2 border-sky-400 pb-1 text-sky-300'
          : 'text-slate-400 transition-opacity hover:text-sky-200 hover:opacity-80'
      }`}
      onClick={(e) => {
        if (href === '#') e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

export function LandingPage() {
  function onCtaSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="dark selection:bg-primary/30 selection:text-primary min-h-screen bg-background font-inter text-on-background antialiased">
      <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sky-400/10 bg-slate-900/40 px-8 text-sm font-medium backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tight text-sky-300">FinMind AI</span>
          <div className="hidden items-center gap-6 md:flex">
            <NavLinkItem href="#" active>
              Overview
            </NavLinkItem>
            <NavLinkItem href="#features">Features</NavLinkItem>
            <NavLinkItem href="#">Pricing</NavLinkItem>
            <NavLinkItem href="#">About</NavLinkItem>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">
              search
            </span>
            <input
              className="focus:ring-primary w-48 rounded-full border border-outline-variant bg-surface-container-low py-1.5 pl-10 pr-4 text-xs transition-all focus:w-64 focus:outline-none focus:ring-1"
              placeholder="Search insights..."
              type="search"
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="material-symbols-outlined cursor-pointer text-slate-400 transition-transform hover:text-sky-300 active:scale-95"
              aria-label="Thông báo"
            >
              notifications
            </Link>
            <Link
              to="/ai-advisor"
              className="material-symbols-outlined cursor-pointer text-slate-400 transition-transform hover:text-sky-300 active:scale-95"
              aria-label="Chat"
            >
              chat_bubble
            </Link>
            <Link
              to="/login"
              className="material-symbols-outlined cursor-pointer text-sky-300 transition-transform active:scale-95"
              aria-label="Tài khoản"
            >
              account_circle
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-full -translate-x-1/2 hero-gradient" />
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-tertiary/5 blur-[120px]" />

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 text-center">
          <div className="border-primary/20 bg-primary/10 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            POWERED BY FINMIND AI
          </div>
          <h1 className="text-on-surface mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Smart Money{' '}
            <span className="from-sky-300 via-sky-100 to-tertiary-fixed-dim bg-gradient-to-r bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-on-surface-variant mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed md:text-xl">
            Take control of your financial destiny with AI-powered forecasting, automated expense tracking,
            and real-time wealth optimization.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="text-on-primary glow-subtle rounded-xl bg-primary px-8 py-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              to="/dashboard"
              className="text-on-surface rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold transition-all hover:bg-white/10"
            >
              View Interactive Demo
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-1 gap-6 text-left md:grid-cols-12">
            <div className="glass-card glow-subtle group rounded-3xl p-8 transition-all hover:border-primary/30 md:col-span-4">
              <div className="border-primary/20 bg-primary/10 group-hover:scale-110 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform">
                <span className="material-symbols-outlined text-primary text-2xl">document_scanner</span>
              </div>
              <h3 className="text-on-surface mb-3 text-xl font-bold">AI Receipt Scanning</h3>
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                Snap a photo and let our neural engine categorize expenses, extract tax data, and detect
                duplicate billings instantly.
              </p>
              <div className="relative h-40 overflow-hidden rounded-2xl">
                <img
                  alt="Smartphone quét hoá đơn"
                  className="h-full w-full object-cover opacity-60"
                  src={imgReceipt}
                />
                <div className="from-surface absolute inset-0 bg-gradient-to-t to-transparent" />
              </div>
            </div>

            <div className="glass-card-elevated glow-subtle rounded-3xl border-primary/20 p-8 md:col-span-8">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1">
                  <div className="border-tertiary/20 bg-tertiary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border">
                    <span className="material-symbols-outlined text-tertiary text-2xl">insights</span>
                  </div>
                  <h3 className="text-on-surface mb-3 text-2xl font-bold">Expenditure Forecasting</h3>
                  <p className="text-on-surface-variant text-md mb-6 leading-relaxed">
                    Predict your future cash flow with high accuracy. FinMind AI analyzes your spending
                    habits to forecast your balance for the next 12 months, identifying potential savings
                    before you spend them.
                  </p>
                  <div className="flex gap-4">
                    <div className="border-primary/10 bg-primary/5 rounded-lg border px-4 py-2">
                      <span className="text-primary font-bold">85%</span>
                      <span className="text-on-surface-variant block text-xs">Avg. Savings Increase</span>
                    </div>
                    <div className="border-tertiary/10 bg-tertiary/5 rounded-lg border px-4 py-2">
                      <span className="text-tertiary font-bold">2.4x</span>
                      <span className="text-on-surface-variant block text-xs">Wealth Velocity</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-full flex-1">
                  <div className="border-outline-variant relative aspect-video overflow-hidden rounded-2xl border bg-surface-container-highest">
                    <img
                      alt="Biểu đồ dự báo trừu tượng"
                      className="h-full w-full object-cover opacity-80"
                      src={imgForecast}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="glass-card scale-110 rounded-xl border border-white/20 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-on-surface text-[10px] font-bold">PREDICTION ACTIVE</span>
                        </div>
                        <div className="flex h-12 w-32 items-end gap-1">
                          <div className="bg-primary/40 h-6 w-4 rounded-sm" />
                          <div className="bg-primary/40 h-8 w-4 rounded-sm" />
                          <div className="bg-primary/60 h-10 w-4 rounded-sm" />
                          <div className="bg-primary/40 h-5 w-4 rounded-sm" />
                          <div className="bg-primary h-12 w-4 rounded-sm shadow-[0_0_10px_rgba(125,211,252,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card glow-subtle group relative overflow-hidden rounded-3xl p-12 md:col-span-12">
              <div className="from-primary/5 absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l to-transparent" />
              <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
                <div className="max-w-xl">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="border-primary/20 bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl border">
                      <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                    </div>
                    <div>
                      <h3 className="text-on-surface text-3xl font-bold">Smart Financial Advisor</h3>
                      <p className="text-primary text-sm font-medium uppercase tracking-widest">
                        24/7 Cognitive Support
                      </p>
                    </div>
                  </div>
                  <p className="text-on-surface-variant mb-8 text-lg leading-relaxed">
                    Imagine a fiduciary expert that lives in your pocket. Ask anything from &quot;Can I afford
                    that trip?&quot; to &quot;How should I rebalance for inflation?&quot; FinMind AI provides instant,
                    data-backed answers tailored to your financial history.
                  </p>
                  <Link
                    to="/ai-advisor"
                    className="text-primary flex items-center gap-2 font-bold transition-transform group-hover:translate-x-2"
                  >
                    Meet your advisor <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
                <div className="w-full flex-shrink-0 md:w-80">
                  <div className="glass-card-elevated space-y-4 rounded-2xl border-white/5 p-6">
                    <div className="flex gap-3">
                      <div className="bg-surface-container-highest flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-xs text-slate-400">person</span>
                      </div>
                      <div className="text-on-surface-variant rounded-2xl rounded-tl-none bg-white/5 p-3 text-xs">
                        Should I invest my $5k bonus or pay off debt?
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <div className="border-primary/20 bg-primary/10 max-w-[80%] rounded-2xl rounded-tr-none border p-3 text-xs text-sky-200">
                        Based on your current 4.2% interest debt vs. market trends, I recommend a 70/30 split.
                        This optimizes your net worth by…
                      </div>
                      <div className="border-primary/40 bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full border">
                        <span
                          className="material-symbols-outlined text-xs text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          auto_awesome
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-16 text-center text-3xl font-bold">The FinMind Ecosystem</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="glass-card flex h-64 flex-col justify-between rounded-2xl border-white/5 p-8 md:col-span-2">
              <span className="material-symbols-outlined mb-4 text-4xl text-sky-300">shield</span>
              <div>
                <h4 className="mb-2 text-lg font-bold">Institutional Security</h4>
                <p className="text-on-surface-variant text-sm">AES-256 encryption with zero-knowledge architecture.</p>
              </div>
            </div>
            <div className="glass-card flex h-64 flex-col items-center justify-center rounded-2xl border-white/5 p-8 text-center">
              <span className="text-primary mb-2 text-4xl font-bold">0.0s</span>
              <p className="text-on-surface-variant text-xs uppercase tracking-tighter">
                Latency on trade execution
              </p>
            </div>
            <div className="glass-card flex h-64 flex-col items-center justify-center rounded-2xl border-white/5 p-8 text-center">
              <span className="material-symbols-outlined text-tertiary mb-4 text-4xl">account_balance_wallet</span>
              <p className="text-sm font-medium">Multi-Bank Aggregation</p>
            </div>
            <div className="glass-card h-64 rounded-2xl border-white/5 p-8 md:col-span-1">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">rocket_launch</span>
              <h4 className="mb-1 font-bold">Growth Engine</h4>
              <p className="text-on-surface-variant text-xs">AI-optimized compound interest strategies.</p>
            </div>
            <div className="glass-card relative flex h-64 items-center overflow-hidden rounded-2xl border-white/5 p-8 md:col-span-3">
              <div className="relative z-10 w-2/3">
                <h4 className="mb-2 text-2xl font-bold">Real-time Global Markets</h4>
                <p className="text-on-surface-variant text-sm">
                  Track crypto, stocks, and commodities in a single unified view with low-latency streaming.
                </p>
              </div>
              <img
                alt="Biểu đồ thị trường"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40"
                src={imgMarkets}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="glass-card-elevated border-primary/20 relative overflow-hidden rounded-[40px] p-16 text-center">
            <div className="absolute inset-0 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to evolve your finances?</h2>
              <p className="text-on-surface-variant mx-auto mb-10 max-w-xl text-lg">
                Join thousands of early adopters building long-term wealth with FinMind.
              </p>
              <form
                className="flex flex-col justify-center gap-4 sm:flex-row"
                onSubmit={onCtaSubmit}
              >
                <input
                  className="focus:ring-primary border-outline-variant w-full rounded-xl border bg-background/50 px-6 py-4 focus:outline-none focus:ring-1 sm:w-80"
                  placeholder="Enter your email"
                  type="email"
                />
                <button
                  type="submit"
                  className="text-on-primary rounded-xl bg-primary px-10 py-4 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </button>
              </form>
              <p className="mt-6 text-xs text-slate-500">Free 14-day trial. No credit card required.</p>
            </div>
          </div>
        </section>

        <footer className="mx-auto max-w-7xl border-t border-white/5 px-8 py-12">
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="space-y-4">
              <span className="text-xl font-bold tracking-tight text-sky-300">FinMind</span>
              <p className="max-w-xs text-sm text-slate-500">
                Building the future of AI-driven personal finance infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
              <div className="space-y-4">
                <h5 className="text-on-surface text-sm font-bold">Product</h5>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="cursor-pointer transition-colors hover:text-primary">Forecasting</li>
                  <li className="cursor-pointer transition-colors hover:text-primary">Advisor</li>
                  <li className="cursor-pointer transition-colors hover:text-primary">Security</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-on-surface text-sm font-bold">Company</h5>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="cursor-pointer transition-colors hover:text-primary">About Us</li>
                  <li className="cursor-pointer transition-colors hover:text-primary">Careers</li>
                  <li className="cursor-pointer transition-colors hover:text-primary">Privacy</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-on-surface text-sm font-bold">Social</h5>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-primary/20">
                    <span className="material-symbols-outlined text-sm">public</span>
                  </div>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-primary/20">
                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 md:flex-row">
            <p>© {new Date().getFullYear()} FinMind. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-on-surface" href="#" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>
              <a className="hover:text-on-surface" href="#" onClick={(e) => e.preventDefault()}>
                Cookie Policy
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
