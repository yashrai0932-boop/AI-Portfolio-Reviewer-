'use client';

import React, { useEffect, useState } from 'react';
import { getScoreColor } from '@/app/lib/types';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  color?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  animated = true,
  color,
  className = '',
}: ProgressBarProps) {
  const [width, setWidth] = useState(animated ? 0 : (value / max) * 100);
  const barColor = color || getScoreColor(value);
  const percentage = (value / max) * 100;

  useEffect(() => {
    if (!animated) return;
    const timeout = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timeout);
  }, [percentage, animated]);

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm text-[var(--pq-text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium tabular-nums" style={{ color: barColor }}>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-[var(--pq-bg-subtle)] overflow-hidden ${heights[size]}`}
      >
        <div
          className="h-full rounded-full relative transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}40`,
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'pq-shimmer 2s infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
