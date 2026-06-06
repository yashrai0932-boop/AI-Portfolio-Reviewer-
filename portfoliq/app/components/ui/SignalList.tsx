import React from 'react';
import type { RecruiterSignal } from '@/app/lib/types';

interface SignalListProps {
  signals: RecruiterSignal[];
  type?: 'positive' | 'negative' | 'all';
  className?: string;
}

export default function SignalList({
  signals,
  type = 'all',
  className = '',
}: SignalListProps) {
  const filtered =
    type === 'all' ? signals : signals.filter((s) => s.type === type);

  return (
    <ul className={`flex flex-col gap-2.5 ${className}`}>
      {filtered.map((signal, i) => (
        <li
          key={i}
          className={`
            flex items-start gap-3 px-4 py-3 rounded-lg
            transition-all duration-200
            ${
              signal.type === 'positive'
                ? 'bg-[var(--pq-success)]/5 hover:bg-[var(--pq-success)]/10'
                : 'bg-[var(--pq-danger)]/5 hover:bg-[var(--pq-danger)]/10'
            }
          `}
        >
          <span className="mt-0.5 flex-shrink-0 text-base">
            {signal.type === 'positive' ? (
              <svg className="w-5 h-5 text-[var(--pq-success)]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[var(--pq-danger)]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <span
              className={`text-sm font-medium ${
                signal.type === 'positive'
                  ? 'text-[#6ee7b7]'
                  : 'text-[#fda4af]'
              }`}
            >
              {signal.text}
            </span>
          </div>
          {signal.impact && (
            <span
              className={`
                text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0
                ${
                  signal.impact === 'high'
                    ? 'bg-[var(--pq-primary-600)]/15 text-[var(--pq-primary-300)]'
                    : signal.impact === 'medium'
                    ? 'bg-[var(--pq-bg-subtle)] text-[var(--pq-text-muted)]'
                    : 'bg-[var(--pq-bg-overlay)] text-[var(--pq-text-muted)]'
                }
              `}
            >
              {signal.impact}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
