import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Currency = 'USD' | 'VND';

const decorImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCUnuT6HuqSDo0TiRI82XfG5xS-1wco6LZ0lxMmqXYY7dsgI4tny5t74OXISLLOsDYmd3ifXg-VYrcMVTKJtTxNLZ0NNMLy58rxr4BmOCk8unHTP6WBu8UxIcjXDY7ZJjuDxAv9pTS8rxOX-CZa5TCcXrosk2z9lh75t0-zFm0E8mURRBWSDimidjM4VzS02KxqcUcMso0SeMpZcNhUFqkGOIDSJlNtM4_EeIWwmYB3Kj2iNplr5g2WF0R8R3pahFFJK2268F2u56zb';

const GOALS = [
  { id: 'car', icon: 'directions_car', title: 'Buy a Car', desc: 'Plan for your dream ride.', tone: 'primary' as const },
  {
    id: 'emergency',
    icon: 'health_and_safety',
    title: 'Emergency Fund',
    desc: '6 months of safety net.',
    tone: 'tertiary' as const,
  },
  { id: 'travel', icon: 'flight_takeoff', title: 'Travel', desc: 'Explore the world debt-free.', tone: 'secondary' as const },
  { id: 'custom', icon: 'add_circle', title: 'Custom Goal', desc: 'Create your own path.', tone: 'variant' as const },
];

function goalIconClass(tone: (typeof GOALS)[number]['tone'], selected: boolean) {
  if (tone === 'primary') return selected ? 'text-primary' : 'text-primary';
  if (tone === 'tertiary') return 'text-tertiary';
  if (tone === 'secondary') return 'text-secondary';
  return 'text-on-surface-variant';
}

export function SetupWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [income, setIncome] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(['car']));

  const progressPct = step === 1 ? 50 : 100;
  const progressLabel = step === 1 ? '50% Complete' : '100% Complete';

  const currencySymbol = currency === 'USD' ? '$' : '₫';

  function toggleGoal(id: string) {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleComplete() {
    if (selectedGoals.size === 0) return;
    navigate('/dashboard');
  }

  const step1Done = step === 2;

  return (
    <div className="dark min-h-screen bg-background font-inter text-on-background selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-tertiary/10 blur-[120px]" />
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
        <div className="mb-12 text-center">
          <h1 className="text-primary mb-2 text-3xl font-extrabold tracking-tight">FinMind</h1>
          <p className="text-on-surface-variant text-sm">Cá nhân hoá hành trình tài sản với AI</p>
        </div>

        <div className="glass-card-elevated glow-subtle flex w-full max-w-4xl flex-col overflow-hidden rounded-xl md:flex-row">
          <div className="w-full border-b border-white/5 bg-slate-900/40 p-8 md:w-72 md:border-b-0 md:border-r">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step1Done
                      ? 'bg-primary text-on-primary'
                      : step === 1
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {step1Done ? (
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  ) : (
                    '1'
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${step === 1 || step1Done ? 'text-primary' : 'text-on-surface'}`}>
                    Basics
                  </p>
                  <p className="text-on-surface-variant text-xs">Currency &amp; Income</p>
                </div>
              </div>

              <div className={`flex items-start gap-4 ${step === 1 ? 'opacity-50' : 'opacity-100'}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    step === 2
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  2
                </div>
                <div>
                  <p className="text-on-surface text-sm font-semibold">Ambition</p>
                  <p className="text-on-surface-variant text-xs">Financial Goals</p>
                </div>
              </div>

              <div className="pt-8">
                <div className="bg-surface-container-highest h-1 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-on-surface-variant mt-2 text-[10px] font-bold uppercase tracking-widest">
                  {progressLabel}
                </p>
              </div>
            </div>

            <div className="mt-24 hidden md:block">
              <div className="border-primary/10 rounded-lg border bg-primary/5 p-4">
                <span className="material-symbols-outlined text-primary mb-2 block">psychology</span>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  AI dùng các thông tin này để dự báo thanh khoản phù hợp với bạn.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/5 p-8 sm:p-12">
            {step === 1 ? (
              <section className="space-y-8" aria-labelledby="setup-step1-title">
                <header>
                  <h2 id="setup-step1-title" className="text-on-surface mb-2 text-2xl font-semibold">
                    Bắt đầu với vài thông tin cơ bản
                  </h2>
                  <p className="text-on-surface-variant">Chọn tiền tệ chính và ước tính dòng tiền hàng tháng.</p>
                </header>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-on-surface-variant text-sm font-medium">Tiền tệ mặc định</span>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`flex items-center justify-center gap-3 rounded-lg border p-4 transition-all ${
                          currency === 'USD'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant bg-surface-container text-on-surface hover:border-primary/50'
                        }`}
                      >
                        <span className="font-bold">USD</span>
                        <span className="text-xs opacity-70">US Dollar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('VND')}
                        className={`flex items-center justify-center gap-3 rounded-lg border p-4 transition-all ${
                          currency === 'VND'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant bg-surface-container text-on-surface hover:border-primary/50'
                        }`}
                      >
                        <span className="font-bold">VND</span>
                        <span className="text-xs opacity-70">Vietnamese Dong</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-on-surface-variant text-sm font-medium" htmlFor="income">
                      Thu nhập hàng tháng
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-primary-fixed-dim font-semibold">{currencySymbol}</span>
                      </div>
                      <input
                        id="income"
                        className="text-on-surface border-outline-variant bg-surface-container focus:border-primary block w-full rounded-lg border py-4 pl-10 pr-4 outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20"
                        placeholder={currency === 'USD' ? '5,000' : '15000000'}
                        type="number"
                        min={0}
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                      />
                    </div>
                    <p className="text-on-surface-variant/60 text-[11px] italic">
                      Bạn có thể chỉnh lại bất cứ lúc nào trong cài đặt.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-on-primary bg-primary hover:bg-surface-tint flex items-center gap-2 rounded-lg px-8 py-3 font-bold transition-all active:scale-[0.98]"
                  >
                    Tiếp: Mục tiêu tài chính
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </section>
            ) : (
              <section className="space-y-8" aria-labelledby="setup-step2-title">
                <header>
                  <h2 id="setup-step2-title" className="text-on-surface mb-2 text-2xl font-semibold">
                    Mục tiêu của bạn là gì?
                  </h2>
                  <p className="text-on-surface-variant">Chọn ít nhất một mục để AI theo dõi.</p>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {GOALS.map((g) => {
                    const selected = selectedGoals.has(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGoal(g.id)}
                        className={`group relative cursor-pointer rounded-xl border p-5 text-left transition-all ${
                          selected
                            ? 'border-primary/20 bg-primary/5 hover:border-primary'
                            : 'border-outline-variant bg-surface-container hover:border-primary/50'
                        }`}
                      >
                        {selected ? (
                          <div className="text-primary absolute right-4 top-4">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          </div>
                        ) : null}
                        <span
                          className={`material-symbols-outlined mb-3 text-3xl ${goalIconClass(g.tone, selected)}`}
                        >
                          {g.icon}
                        </span>
                        <h3 className="text-on-surface font-bold">{g.title}</h3>
                        <p className="text-on-surface-variant mt-1 text-xs">{g.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-on-surface-variant hover:text-on-surface flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Quay lại
                  </button>
                  <button
                    type="button"
                    disabled={selectedGoals.size === 0}
                    onClick={handleComplete}
                    className="text-on-primary bg-primary hover:bg-surface-tint rounded-lg px-8 py-3 font-bold transition-all enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Hoàn tất thiết lập
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="text-on-surface-variant/40 mt-8 flex items-center justify-center gap-2 text-center text-xs">
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          Dữ liệu tài chính được mã hoá và không chia sẻ cho bên thứ ba.
        </div>
      </main>

      <div className="pointer-events-none fixed right-[10%] top-[20%] h-64 w-64 opacity-20">
        <img
          alt=""
          className="h-full w-full rounded-full object-cover mix-blend-screen grayscale"
          src={decorImg}
        />
      </div>
    </div>
  );
}
