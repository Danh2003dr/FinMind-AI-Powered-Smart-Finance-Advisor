import { Link, NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const avatarImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCjGK0YrAJirYd8QnKCKBRipxpexr1CS5_TrrAOjyFVu1HeXjbbhz_TXZIhI98oX2QAxvXIU-1t7Vt6ETxDL-xBJdgxsfMXx7WIxpyFTXN6KP7BcKLlwupQhu_rRaeb9IuYq6aNzW9AXTE_81kOaJeE7IlUENGVKs1vQqYqCw15KY5SoWhKWBqLzbXzWzWIvlcFuEeUiU3kCmFVEUqCxQu02DeWISXoUpixySM8k1yRGe1uWXfk7fvV6hSUSDX3jqlJNgO2LoZFWvR1';

function tabClass(isActive: boolean) {
  return `cursor-pointer transition-transform active:scale-95 ${
    isActive ? 'border-b-2 border-sky-400 pb-1 text-sky-300' : 'text-slate-400 hover:text-sky-200'
  }`;
}

export function Navbar() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sky-400/10 bg-slate-900/40 px-6 text-sm font-medium backdrop-blur-md md:px-10">
      <div className="flex min-w-0 items-center gap-4 md:gap-8">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
          aria-label="Mở menu"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <span className="hidden text-lg font-bold text-sky-300 sm:inline md:hidden">FinMind AI</span>
        <div className="hidden gap-6 md:flex">
          <NavLink to="/dashboard" end className={({ isActive }) => tabClass(isActive)}>
            Overview
          </NavLink>
          <NavLink to="/budgets" className={({ isActive }) => tabClass(isActive)}>
            Budgets
          </NavLink>
          <button type="button" className={tabClass(false)}>
            Investments
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="group relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            search
          </span>
          <input
            className="border-sky-400/10 bg-surface-container-low focus:border-primary/40 w-48 rounded-full border py-1.5 pl-10 pr-4 text-xs outline-none transition-all focus:w-64 focus:ring-1 focus:ring-primary/40"
            placeholder="Search portfolios..."
            type="search"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `hidden items-center justify-center rounded-full p-2 transition-all active:scale-90 sm:inline-flex ${
                isActive ? 'bg-white/5 text-sky-300' : 'text-slate-400 hover:text-primary'
              }`
            }
            aria-label="Thông báo"
          >
            <span className="material-symbols-outlined">notifications</span>
          </NavLink>
          <span className="material-symbols-outlined hidden cursor-pointer text-slate-400 transition-all hover:text-primary active:scale-90 sm:inline">
            chat_bubble
          </span>
          <Link
            to="/profile"
            className="border-primary/20 h-8 w-8 overflow-hidden rounded-full border transition-opacity hover:opacity-90"
            aria-label="Hồ sơ"
          >
            <img alt="" className="h-full w-full object-cover" src={avatarImg} />
          </Link>
        </div>
      </div>
    </header>
  );
}
