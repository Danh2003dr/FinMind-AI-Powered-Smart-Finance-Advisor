/** Lưu decimal trong DB dạng chuỗi cố định 2 chữ số */
export function toMoneyString(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

export function parseMoney(s: string): number {
  return Number.parseFloat(s);
}
