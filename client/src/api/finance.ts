import { apiClient } from './client';

export type CategoryDto = { id: string; name: string };

export type TransactionDto = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  category?: string;
  categoryId: string | null;
  status: string;
  methodType: string | null;
  methodLabel: string | null;
};

export type BudgetDto = {
  id: string;
  name: string;
  subtitle: string | null;
  icon: string;
  capAmount: number;
  currency: string;
  categoryId: string | null;
  categoryName: string | null;
  spentAmount: number;
  progressPct: number;
};

export type SavingGoalDto = {
  id: string;
  title: string;
  subtitle: string | null;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  icon: string;
  badge: string | null;
  priority: string;
  progressPct: number;
};

export type AccountDto = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
};

export type NotificationDto = {
  id: string;
  category: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type DashboardSummary = {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: TransactionDto[];
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getCategories(): Promise<CategoryDto[]> {
  const { data } = await apiClient.get<CategoryDto[]>('/categories');
  return data;
}

export async function getTransactions(params?: {
  from?: string;
  to?: string;
  q?: string;
}): Promise<TransactionDto[]> {
  const { data } = await apiClient.get<TransactionDto[]>('/transactions', { params });
  return data;
}

export async function getBudgets(): Promise<BudgetDto[]> {
  const { data } = await apiClient.get<BudgetDto[]>('/budgets');
  return data;
}

export async function getSavingGoals(): Promise<SavingGoalDto[]> {
  const { data } = await apiClient.get<SavingGoalDto[]>('/saving-goals');
  return data;
}

export async function getAccounts(): Promise<AccountDto[]> {
  const { data } = await apiClient.get<AccountDto[]>('/accounts');
  return data;
}

export async function getNotifications(): Promise<NotificationDto[]> {
  const { data } = await apiClient.get<NotificationDto[]>('/notifications');
  return data;
}

export async function markNotificationRead(id: string): Promise<NotificationDto> {
  const { data } = await apiClient.patch<NotificationDto>(`/notifications/${id}/read`);
  return data;
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

export async function postOcrParse(text: string): Promise<{ lines: string[] }> {
  const { data } = await apiClient.post<{ lines: string[] }>('/ocr/receipts/parse', { text });
  return data;
}

export type CreateTransactionPayload = {
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  categoryId?: string;
  status?: string;
  methodType?: string;
  methodLabel?: string;
};

export async function postTransaction(body: CreateTransactionPayload): Promise<TransactionDto> {
  const { data } = await apiClient.post<TransactionDto>('/transactions', body);
  return data;
}
