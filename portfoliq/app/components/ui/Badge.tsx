import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[var(--pq-bg-subtle)] text-[var(--pq-text-secondary)] border border-[var(--pq-border)]',
    primary: 'bg-[var(--pq-primary-600)]/15 text-[var(--pq-primary-300)] border border-[var(--pq-primary-600)]/20',
    success: 'bg-[var(--pq-success)]/15 text-[#6ee7b7] border border-[var(--pq-success)]/20',
    warning: 'bg-[var(--pq-warning)]/15 text-[#fcd34d] border border-[var(--pq-warning)]/20',
    danger: 'bg-[var(--pq-danger)]/15 text-[#fda4af] border border-[var(--pq-danger)]/20',
    accent: 'bg-[var(--pq-accent-500)]/15 text-[var(--pq-accent-400)] border border-[var(--pq-accent-500)]/20',
    outline: 'bg-transparent text-[var(--pq-text-secondary)] border border-[var(--pq-border)]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-[var(--pq-success)]'
              : variant === 'danger'
              ? 'bg-[var(--pq-danger)]'
              : variant === 'warning'
              ? 'bg-[var(--pq-warning)]'
              : variant === 'primary'
              ? 'bg-[var(--pq-primary-400)]'
              : variant === 'accent'
              ? 'bg-[var(--pq-accent-400)]'
              : 'bg-[var(--pq-text-muted)]'
          }`}
        />
      )}
      {children}
    </span>
  );
}
