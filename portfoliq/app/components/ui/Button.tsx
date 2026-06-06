'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-250 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pq-bg-base)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    cursor-pointer select-none
  `;

  const variants: Record<string, string> = {
    primary: `
      bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)]
      text-white shadow-lg shadow-[var(--pq-primary-600)]/20
      hover:shadow-xl hover:shadow-[var(--pq-primary-600)]/30
      hover:from-[var(--pq-primary-500)] hover:to-[var(--pq-primary-400)]
      hover:scale-[1.02] active:scale-[0.98]
      focus-visible:ring-[var(--pq-primary-500)]
    `,
    secondary: `
      bg-[var(--pq-bg-overlay)] border border-[var(--pq-border)]
      text-[var(--pq-text-primary)]
      hover:bg-[var(--pq-bg-subtle)] hover:border-[var(--pq-border-hover)]
      hover:scale-[1.02] active:scale-[0.98]
      focus-visible:ring-[var(--pq-primary-500)]
    `,
    ghost: `
      bg-transparent text-[var(--pq-text-secondary)]
      hover:bg-[var(--pq-bg-overlay)] hover:text-[var(--pq-text-primary)]
      active:scale-[0.98]
      focus-visible:ring-[var(--pq-primary-500)]
    `,
    danger: `
      bg-[var(--pq-danger)]/10 border border-[var(--pq-danger)]/20
      text-[var(--pq-danger)]
      hover:bg-[var(--pq-danger)]/20 hover:border-[var(--pq-danger)]/30
      hover:scale-[1.02] active:scale-[0.98]
      focus-visible:ring-[var(--pq-danger)]
    `,
    accent: `
      bg-gradient-to-r from-[var(--pq-accent-600)] to-[var(--pq-accent-400)]
      text-white shadow-lg shadow-[var(--pq-accent-500)]/20
      hover:shadow-xl hover:shadow-[var(--pq-accent-500)]/30
      hover:scale-[1.02] active:scale-[0.98]
      focus-visible:ring-[var(--pq-accent-500)]
    `,
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
