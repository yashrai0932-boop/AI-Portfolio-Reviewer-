'use client';

import React, { useEffect, useState } from 'react';
import { getScoreColor } from '@/app/lib/types';

interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showScore?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  showScore = true,
  animated = true,
  className = '',
}: ProgressRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const center = size / 2;
  const color = getScoreColor(score);

  useEffect(() => {
    if (!animated) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--pq-bg-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: animated ? 'none' : 'stroke-dashoffset 0.8s ease-out',
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        {showScore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: size * 0.28,
                color,
              }}
            >
              {animatedScore}
            </span>
            <span
              className="text-[var(--pq-text-muted)] font-medium"
              style={{ fontSize: size * 0.11 }}
            >
              / 100
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-[var(--pq-text-secondary)]">
          {label}
        </span>
      )}
    </div>
  );
}
