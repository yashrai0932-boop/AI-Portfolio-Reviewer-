'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export default function Input({
  label,
  error,
  icon,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--pq-text-secondary)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pq-text-muted)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-[var(--pq-bg-overlay)] border rounded-xl
            text-[var(--pq-text-primary)] placeholder-[var(--pq-text-muted)]
            transition-all duration-250 ease-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            py-3 text-sm
            ${
              error
                ? 'border-[var(--pq-danger)]/50 focus:ring-[var(--pq-danger)]/30 focus:border-[var(--pq-danger)]'
                : 'border-[var(--pq-border)] focus:ring-[var(--pq-primary-500)]/30 focus:border-[var(--pq-primary-500)]/50 hover:border-[var(--pq-border-hover)]'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[var(--pq-danger)] flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-[var(--pq-text-muted)]">{helperText}</p>
      )}
    </div>
  );
}
