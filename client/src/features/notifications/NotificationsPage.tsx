import { useMemo, useState } from 'react';

type FilterTab = 'all' | 'ai' | 'budget' | 'security';
type NotifCategory = 'ai' | 'budget' | 'security' | 'report';

type NotifItem = {
  id: string;
  category: NotifCategory;
  title: string;
  time: string;
  body: string;
  icon: string;
  iconFill?: boolean;
  iconWrap: string;
  borderLeft?: string;
  tags?: { label: string; className: string }[];
  unread?: boolean;
  showMarkRead?: boolean;
};

const SEED: NotifItem[] = [
  {
    id: '1',
    category: 'ai',
    title: 'Thông báo AI: Cơ hội đầu tư mới',
    time: '2 giờ trước',
    body:
      'Dựa trên xu hướng chi tiêu của bạn, AI đã phát hiện một cơ hội tiết kiệm 15% vào quỹ nghỉ hưu thông qua tối ưu hóa danh mục.',
    icon: 'auto_awesome',
    iconFill: true,
    iconWrap: 'bg-primary-container text-primary shadow-inner',
    borderLeft: 'border-l-4 border-l-primary',
    tags: [
      { label: 'Mới', className: 'bg-primary/10 text-primary' },
      { label: 'Ưu tiên cao', className: 'bg-tertiary/10 text-tertiary' },
    ],
    unread: true,
    showMarkRead: true,
  },
  {
    id: '2',
    category: 'budget',
    title: 'Cảnh báo ngân sách: Ăn uống',
    time: '5 giờ trước',
    body:
      'Bạn đã sử dụng 85% hạn mức ngân sách cho mục "Ăn uống" trong tháng này. Hãy cân nhắc điều chỉnh chi tiêu.',
    icon: 'wallet',
    iconFill: true,
    iconWrap: 'bg-tertiary-container text-tertiary',
  },
  {
    id: '3',
    category: 'security',
    title: 'Cảnh báo bảo mật',
    time: 'Hôm qua',
    body:
      'Phát hiện lần đăng nhập mới từ thiết bị lạ tại TP. Hồ Chí Minh. Nếu không phải là bạn, hãy đổi mật khẩu ngay lập tức.',
    icon: 'shield',
    iconFill: true,
    iconWrap: 'bg-error-container text-error',
    borderLeft: 'border-l-4 border-l-error/50',
  },
  {
    id: '4',
    category: 'report',
    title: 'Báo cáo tuần đã sẵn sàng',
    time: '2 ngày trước',
    body:
      'Tổng kết tuần qua: Thu nhập của bạn tăng 12% so với tuần trước. Xem chi tiết báo cáo để biết thêm.',
    icon: 'monitoring',
    iconWrap: 'bg-secondary-container text-secondary',
  },
];

const FILTER_TABS: { id: FilterTab; label: string; icon?: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ai', label: 'AI Insights', icon: 'bolt' },
  { id: 'budget', label: 'Cảnh báo ngân sách', icon: 'account_balance_wallet' },
  { id: 'security', label: 'Bảo mật', icon: 'verified_user' },
];

function matchesFilter(item: NotifItem, tab: FilterTab) {
  if (tab === 'all') return true;
  if (tab === 'ai') return item.category === 'ai';
  if (tab === 'budget') return item.category === 'budget';
  if (tab === 'security') return item.category === 'security';
  return true;
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [items, setItems] = useState<NotifItem[]>(SEED);
  const [prefs, setPrefs] = useState({ ai: true, budget: true, security: true });

  const visible = useMemo(() => items.filter((n) => matchesFilter(n, filter)), [items, filter]);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="font-inter text-on-surface flex w-full min-w-0 flex-col gap-8 xl:flex-row">
      <div className="min-w-0 flex-1 xl:max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-on-surface mb-2 text-3xl font-bold tracking-tight">Thông báo chi tiết</h1>
            <p className="text-on-surface-variant text-sm">
              Cập nhật những hoạt động tài chính mới nhất của bạn.
            </p>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="text-primary hover:bg-primary/10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">done_all</span>
            Đánh dấu đã đọc
          </button>
        </div>

        <div className="glass-card mb-6 flex max-w-fit flex-wrap items-center gap-1 rounded-xl p-1">
          {FILTER_TABS.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'text-on-primary bg-primary shadow-lg shadow-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                }`}
              >
                {t.icon ? (
                  <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                ) : null}
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {visible.length === 0 ? (
            <p className="text-on-surface-variant text-sm">Không có thông báo trong mục này.</p>
          ) : (
            visible.map((n) => (
              <div
                key={n.id}
                className={`group glass-card relative flex cursor-pointer items-start gap-4 rounded-xl p-4 transition-all hover:border-sky-400/20 hover:shadow-lg ${n.borderLeft ?? ''}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${n.iconWrap}`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={n.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {n.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-on-surface font-semibold">{n.title}</h3>
                    <span className="text-on-surface-variant shrink-0 text-[11px] font-medium uppercase tracking-wider">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mb-3 text-sm leading-relaxed">{n.body}</p>
                  {n.tags ? (
                    <div className="flex flex-wrap gap-2">
                      {n.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${tag.className}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {n.unread ? (
                  <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(125,211,252,0.8)]" />
                ) : null}
                <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {n.showMarkRead ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markRead(n.id);
                      }}
                      className="text-primary hover:bg-primary/20 rounded-lg p-2"
                      title="Đánh dấu đã đọc"
                    >
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n.id);
                    }}
                    className={`rounded-lg p-2 hover:bg-error/20 ${n.showMarkRead ? 'text-error' : 'text-on-surface-variant hover:bg-white/5'}`}
                    title="Xóa"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="w-full shrink-0 xl:w-80">
        <div className="glass-elevated sticky top-24 rounded-2xl p-6">
          <h2 className="text-on-surface mb-6 flex items-center gap-2 text-lg font-bold">
            <span className="material-symbols-outlined text-primary">tune</span>
            Cài đặt thông báo
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-on-surface text-sm font-semibold">AI Insights</p>
                <p className="text-on-surface-variant text-xs">Phân tích chi tiêu thông minh</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.ai}
                  onChange={(e) => setPrefs((p) => ({ ...p, ai: e.target.checked }))}
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-container after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none" />
              </label>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-on-surface text-sm font-semibold">Ngân sách</p>
                <p className="text-on-surface-variant text-xs">Cảnh báo khi vượt hạn mức</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.budget}
                  onChange={(e) => setPrefs((p) => ({ ...p, budget: e.target.checked }))}
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-container after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none" />
              </label>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-on-surface text-sm font-semibold">Bảo mật</p>
                <p className="text-on-surface-variant text-xs">Đăng nhập và giao dịch lạ</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={prefs.security}
                  onChange={(e) => setPrefs((p) => ({ ...p, security: e.target.checked }))}
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-container after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none" />
              </label>
            </div>
            <div className="border-t border-sky-400/10 pt-6">
              <div className="glass-card rounded-xl p-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mail
                  </span>
                  <p className="text-on-surface text-sm font-semibold">Email tóm tắt</p>
                </div>
                <p className="text-on-surface-variant mb-4 text-xs">
                  Nhận báo cáo tổng hợp vào sáng Thứ Hai hàng tuần.
                </p>
                <button
                  type="button"
                  className="border-sky-400/20 hover:bg-white/10 w-full rounded-lg border bg-white/5 py-2 text-xs font-medium transition-all"
                >
                  Thiết lập tần suất
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
