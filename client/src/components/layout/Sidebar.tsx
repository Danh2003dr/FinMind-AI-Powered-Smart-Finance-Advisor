import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';

function navClass(active: boolean) {
  return active
    ? 'flex items-center gap-3 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sky-300 transition-all duration-200 active:scale-[0.98]'
    : 'flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200 active:scale-[0.98]';
}

type NavItemProps = { to: string; icon: string; label: string; end?: boolean; onNavigate?: () => void };

function NavItem({ to, icon, label, end, onNavigate }: NavItemProps) {
  return (
    <NavLink to={to} end={end} onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined"
            style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

function PlaceholderNav({ icon, label }: { icon: string; label: string }) {
  return (
    <a
      href="#"
      className={navClass(false)}
      onClick={(e) => e.preventDefault()}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </a>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sky-400/10 bg-slate-900/60 p-4 text-sm font-medium shadow-[0_0_30px_rgba(125,211,252,0.05)] backdrop-blur-xl transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-8 px-4 py-2">
          <h1 className="text-xl font-semibold tracking-tight text-sky-300">FinMind</h1>
          <p className="text-xs font-normal text-slate-500">AI-Powered Assets</p>
        </div>
        <nav className="flex flex-1 flex-col space-y-1 overflow-y-auto">
          <NavItem
            to="/dashboard"
            icon="dashboard"
            label="Dashboard"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/budgets"
            icon="account_balance_wallet"
            label="Ngân sách"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/saving-goals"
            icon="savings"
            label="Mục tiêu tiết kiệm"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <PlaceholderNav icon="account_balance" label="Accounts" />
          <NavItem
            to="/transactions"
            icon="receipt_long"
            label="Transactions"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/transactions/scan"
            icon="document_scanner"
            label="Quét OCR"
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/analytics"
            icon="insights"
            label="Analytics"
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/ai-advisor"
            icon="psychology"
            label="AI Insights"
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/profile"
            icon="person"
            label="Hồ sơ"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavItem
            to="/notifications"
            icon="notifications"
            label="Thông báo"
            end
            onNavigate={() => setSidebarOpen(false)}
          />
          <PlaceholderNav icon="settings" label="Settings" />
        </nav>
        <div className="mt-auto space-y-1 pt-6">
          <Link
            to="/ai-advisor"
            className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 mb-6 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold transition-all active:scale-95"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Ask AI Assistant
          </Link>
          <PlaceholderNav icon="help" label="Support" />
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-400 transition-colors hover:text-red-400"
            onClick={() => {
              logout();
              setSidebarOpen(false);
              navigate('/login', { replace: true });
            }}
          >
            <span className="material-symbols-outlined text-error">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
