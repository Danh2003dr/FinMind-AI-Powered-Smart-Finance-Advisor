import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-surface-border bg-surface-muted/60 p-4 shadow-sm backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`font-display text-lg font-semibold tracking-tight text-slate-50 ${className}`}
      {...props}
    />
  );
}
