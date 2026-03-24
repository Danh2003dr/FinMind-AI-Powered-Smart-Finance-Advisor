export function formatDate(
  input: string | number | Date,
  locale = 'vi-VN',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const d = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat(locale, options).format(d);
}
