import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getMe, patchProfile } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

const profileMainImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD40QKRnQgcTqq0IJT5_8pxX5o17O_pmP8rjmeMO4xan-_6wOJpKkKWrED3_oE2N2NgXlo3YlgMm0GI7kJEryz30AzqkZxDprFMkg95O2f24rz-pRodpf99gnpPToBGwr-u4YxJo7LNS4kbvyKY40RDoBFUUImxm6iaxAruEIj8nASBf7At2sDD8tYP4zD4pXpf_ci39SQJwDlav7A2Tp3tiWTqE_RmZ1Wl28TOWF6veFqT9IlT--35IRD_fNEvO2UbGBT1JbD7iZSr';

function subNavClass(active: boolean) {
  return active
    ? 'flex items-center gap-3 rounded-xl border border-sky-400/20 bg-sky-400/15 px-4 py-3 text-sky-300 transition-all'
    : 'flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:bg-white/5 hover:text-slate-200';
}

export function ProfilePage() {
  const { token, login } = useAuth();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [twoFa, setTwoFa] = useState(true);

  const { data: me, isPending } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (me) {
      setFullName(me.name);
      setEmail(me.email);
      setPhone(me.phone ?? '');
    }
  }, [me]);

  const saveMut = useMutation({
    mutationFn: () =>
      patchProfile({
        displayName: fullName.trim(),
        phone: phone.trim() || undefined,
      }),
    onSuccess: (u) => {
      if (token) login(token, u);
      void qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  return (
    <div className="font-inter text-on-surface mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-8 md:flex-row">
      <aside className="hidden h-fit w-64 shrink-0 flex-col gap-2 rounded-xl border-r border-sky-400/10 bg-slate-950/75 p-4 shadow-2xl backdrop-blur-2xl md:flex md:sticky md:top-24">
        <div className="mb-6 px-4 py-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-sky-300">Executive Suite</h2>
          <p className="text-[10px] font-medium text-slate-500">Verified Member</p>
        </div>
        <NavLink to="/dashboard" className={({ isActive }) => subNavClass(isActive)} end>
          <span className="material-symbols-outlined">account_balance</span>
          <span className="text-sm font-medium">Portfolio</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => subNavClass(isActive)}>
          <span className="material-symbols-outlined">insights</span>
          <span className="text-sm font-medium">Analytics</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => subNavClass(isActive)}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm font-medium">Profile</span>
        </NavLink>
        <a href="#bao-mat" className={subNavClass(false)}>
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-sm font-medium">Security</span>
        </a>
        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-8">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-400 transition-all hover:bg-white/5"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            type="button"
            className="mt-4 rounded-xl border border-sky-400/30 bg-sky-400/10 py-3 text-sm font-bold text-sky-300 transition-all duration-300 hover:bg-sky-400/20 active:scale-95"
          >
            Export Data
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass-elevated relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl p-8 shadow-[0_0_30px_rgba(125,211,252,0.05)] md:flex-row md:items-start lg:col-span-2">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-3xl border-2 border-primary/30 shadow-2xl">
                <img alt="" className="h-full w-full object-cover" src={profileMainImg} />
              </div>
              <button
                type="button"
                className="text-on-primary bg-primary absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-90"
                aria-label="Đổi ảnh đại diện"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </button>
            </div>
            <div className="relative flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center">
                <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                  {isPending ? '…' : fullName || me?.name}
                </h1>
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  <span className="material-symbols-outlined mr-1 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    diamond
                  </span>
                  Diamond Member
                </span>
              </div>
              <p className="text-on-surface-variant mb-6">{isPending ? '…' : email}</p>
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <button
                  type="button"
                  className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-xl border px-6 py-2.5 font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel flex flex-col justify-between rounded-3xl border-tertiary/20 p-8">
            <div>
              <span className="text-tertiary mb-2 block text-xs font-bold uppercase tracking-widest">Tài khoản</span>
              <div className="text-on-surface text-2xl font-semibold">Đã xác minh</div>
              <p className="text-on-surface-variant mt-2 text-sm">Thành viên từ Tháng 1, 2023</p>
            </div>
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-on-surface-variant">Hạn mức giao dịch</span>
                <span className="text-primary">85%</span>
              </div>
              <div className="bg-surface-container h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(125,211,252,0.5)]" />
              </div>
            </div>
          </div>
        </section>

        <section id="bao-mat" className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="flex items-center gap-3 px-2 text-xl font-semibold">
              <span className="material-symbols-outlined text-primary">person_outline</span>
              Thông tin cá nhân
            </h3>
            <div className="glass-panel space-y-5 rounded-3xl p-6">
              <div className="space-y-2">
                <label className="text-on-surface-variant ml-1 text-xs font-semibold uppercase tracking-wider">
                  Họ và tên
                </label>
                <input
                  className="border-outline-variant bg-surface-container/50 text-on-surface focus:border-primary focus:ring-primary/50 w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant ml-1 text-xs font-semibold uppercase tracking-wider">
                  Địa chỉ Email
                </label>
                <input
                  className="border-outline-variant bg-surface-container/30 text-on-surface-variant w-full cursor-not-allowed rounded-xl border px-4 py-3 outline-none"
                  type="email"
                  readOnly
                  title="Email không đổi từ trang hồ sơ"
                  value={email}
                />
              </div>
              <div className="space-y-2">
                <label className="text-on-surface-variant ml-1 text-xs font-semibold uppercase tracking-wider">
                  Số điện thoại
                </label>
                <input
                  className="border-outline-variant bg-surface-container/50 text-on-surface focus:border-primary focus:ring-primary/50 w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="button"
                disabled={saveMut.isPending}
                onClick={() => saveMut.mutate()}
                className="text-on-primary bg-primary mt-2 w-full rounded-xl py-3 font-bold transition-all hover:shadow-[0_0_20px_rgba(125,211,252,0.3)] active:scale-95 disabled:opacity-60"
              >
                {saveMut.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-3 px-2 text-xl font-semibold">
              <span className="material-symbols-outlined text-tertiary">lock</span>
              Bảo mật hệ thống
            </h3>
            <div className="glass-panel space-y-6 rounded-3xl p-6">
              <button
                type="button"
                className="group border-white/5 bg-surface-container/30 hover:bg-surface-container/50 flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <span className="material-symbols-outlined">password</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-on-surface font-medium">Đổi mật khẩu</h4>
                    <p className="text-on-surface-variant text-xs">Cập nhật mật khẩu để bảo mật hơn</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </button>

              <div className="border-white/5 bg-surface-container/30 rounded-2xl border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-tertiary/10 text-tertiary flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                      <h4 className="text-on-surface font-medium">Xác thực 2 lớp (2FA)</h4>
                      <p className="text-on-surface-variant text-xs">Bảo vệ tài khoản qua Authenticator App</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={twoFa}
                      onChange={(e) => setTwoFa(e.target.checked)}
                    />
                    <div className="peer h-6 w-12 rounded-full bg-slate-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none rtl:peer-checked:after:-translate-x-full" />
                  </label>
                </div>
                <p className="text-on-surface-variant mt-2 border-t border-white/5 px-1 pt-3 text-[11px]">
                  Tình trạng:{' '}
                  <span className="text-primary font-bold uppercase">
                    {twoFa ? 'Đang hoạt động' : 'Đã tắt'}
                  </span>
                </p>
              </div>

              <button
                type="button"
                className="group border-white/5 bg-surface-container/30 hover:bg-surface-container/50 flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 text-secondary flex h-12 w-12 items-center justify-center rounded-xl">
                    <span className="material-symbols-outlined">devices</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-on-surface font-medium">Thiết bị đăng nhập</h4>
                    <p className="text-on-surface-variant text-xs">Quản lý các phiên đăng nhập hiện tại</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
