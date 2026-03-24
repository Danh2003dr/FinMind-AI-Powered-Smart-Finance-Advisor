import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { postLogin, postRegister } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { isAxiosError } from 'axios';

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMXriIYyMmSGSLbeK1maznQTXW9pkATeRsWiWxkGZRVUDkYXfT5sNL3n_t3rv5rGuCsSaqQnGGl5RPu1LwSbPHxfABe63bp9vRV0jGhO1IkVPaxYWSWsK1rdsHHKgn9eSykymKAkNwiS6pIYopJeuLJjBzinE_73xJDlGwX9E6Igw7JFOwxZ-ycSmE7UIpGS4OJKXRD-UNCmqdSEqDiK0vAoboYvEJFrL8lnFao_GIbCYFCfHDwUtCogutisvXXJSoboEAnQ75xLf4';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const m = err.response?.data as { message?: string | string[] } | undefined;
    if (typeof m?.message === 'string') return m.message;
    if (Array.isArray(m?.message)) return m.message.join(', ');
  }
  return 'Có lỗi xảy ra. Thử lại.';
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await postRegister({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
        });
        login(res.accessToken, res.user);
      } else {
        const res = await postLogin({ email: email.trim(), password });
        login(res.accessToken, res.user);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark min-h-screen overflow-hidden bg-background font-glacier text-on-background">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-tertiary/10 blur-[120px]" />

      <main className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-8 p-6 lg:grid-cols-2 lg:p-12">
        <div className="hidden flex-col justify-center space-y-8 pr-12 lg:flex">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary-container">
                <span
                  className="material-symbols-outlined text-primary text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  ac_unit
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">FinMind</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-on-surface">
              Làm chủ dòng tiền với <span className="text-primary">độ chính xác tuyệt đối.</span>
            </h1>
            <p className="max-w-md text-lg text-on-surface-variant">
              Gợi ý tài chính thông minh, giao diện rõ ràng — bảo mật và minh bạch cho tài sản của
              bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel space-y-2 rounded-xl p-4">
              <span className="material-symbols-outlined text-primary">security</span>
              <h3 className="font-semibold text-on-surface">Bảo mật tầng lớp</h3>
              <p className="text-xs text-on-surface-variant">
                Mã hoá và phân quyền cho dữ liệu nhạy cảm.
              </p>
            </div>
            <div className="glass-panel space-y-2 rounded-xl p-4">
              <span className="material-symbols-outlined text-tertiary">bolt</span>
              <h3 className="font-semibold text-on-surface">Đồng bộ tức thì</h3>
              <p className="text-xs text-on-surface-variant">
                Theo dõi giao dịch và danh mục theo thời gian thực.
              </p>
            </div>
          </div>

          <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-primary/10 glass-panel">
            <img
              alt="Minh hoạ dữ liệu trừu tượng"
              className="h-full w-full object-cover opacity-50 grayscale transition-all duration-700 hover:grayscale-0"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Trạng thái hệ thống
              </p>
              <p className="text-sm text-on-surface">API + SQLite sẵn sàng</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="glass-panel ice-glow w-full max-w-md space-y-8 rounded-3xl p-8 lg:p-10">
            <div className="space-y-2 text-center">
              <div className="mb-6 flex justify-center lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary-container">
                  <span
                    className="material-symbols-outlined text-primary text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ac_unit
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-on-surface">
                {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
              </h2>
              <p className="text-sm text-on-surface-variant">
                {mode === 'login' ? 'Đăng nhập để vào FinMind' : 'Đăng ký — mật khẩu tối thiểu 8 ký tự'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="glass-input flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all hover:bg-white/5"
              >
                <GoogleIcon />
                Google
              </button>
              <button
                type="button"
                className="glass-input flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all hover:bg-white/5"
              >
                <GitHubIcon />
                GitHub
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/5" />
              <span className="absolute bg-[#121a2b] px-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
                hoặc email
              </span>
            </div>

            {error ? (
              <p className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-center text-sm text-error">
                {error}
              </p>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-medium text-on-surface-variant" htmlFor="name">
                    Tên hiển thị
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="glass-input w-full rounded-xl py-3 px-4 text-on-surface placeholder:text-on-surface-variant/40"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label
                  className="ml-1 text-sm font-medium text-on-surface-variant"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-primary opacity-60">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="glass-input w-full rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="password">
                    Mật khẩu
                  </label>
                  <a
                    className="text-xs text-primary transition-colors hover:text-white"
                    href="#"
                    onClick={(ev) => ev.preventDefault()}
                  >
                    Quên?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-primary opacity-60">
                    lock
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={mode === 'register' ? 8 : 1}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    className="glass-input w-full rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full transform items-center justify-center gap-2 rounded-xl bg-primary-container py-4 font-bold text-on-primary-container transition-all duration-300 hover:bg-primary hover:text-on-primary active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="pt-4 text-center">
              <p className="text-sm text-on-surface-variant">
                {mode === 'login' ? (
                  <>
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      className="font-semibold text-primary decoration-primary/30 underline-offset-4 hover:underline"
                      onClick={() => {
                        setMode('register');
                        setError(null);
                      }}
                    >
                      Tạo tài khoản FinMind
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                      }}
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 opacity-40 grayscale">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">SOC2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">encrypted</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">AES-256</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">AI Audited</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="pointer-events-none absolute right-[15%] top-[20%] hidden h-32 w-32 rotate-12 rounded-2xl glass-panel opacity-20 lg:block" />
      <div className="pointer-events-none absolute bottom-[20%] left-[10%] hidden h-24 w-24 -rotate-12 rounded-full glass-panel opacity-20 lg:block" />
    </div>
  );
}
