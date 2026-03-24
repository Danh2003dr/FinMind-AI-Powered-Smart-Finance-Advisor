export const advisorSystemPrompt = `Bạn là trợ lý tài chính cá nhân FinMind. Trả lời ngắn gọn, rõ ràng, nhắc rủi ro khi liên quan đầu tư hoặc nợ. Không đưa lời khuyên pháp lý.`;

export function buildAdvisorUserPrompt(userQuestion: string): string {
  return `Câu hỏi người dùng:\n${userQuestion}`;
}
