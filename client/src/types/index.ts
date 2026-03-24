export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
};

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  category?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};
