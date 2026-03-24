import { apiClient } from './client';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type AdvisorChatResponse = { reply: string; provider: 'gemini' | 'fallback' };

export async function postAdvisorChat(messages: ChatTurn[]): Promise<AdvisorChatResponse> {
  const { data } = await apiClient.post<AdvisorChatResponse>(
    '/ai/advisor/chat',
    { messages },
    { timeout: 90_000 },
  );
  return data;
}
