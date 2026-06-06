import React from 'react';
import Card from './Card';
import ProgressRing from './ProgressRing';

interface ScoreCardProps {
  score: number;
  label: string;
  ringSize?: number;
  description?: string;
  className?: string;
}

export default function ScoreCard({
  score,
  label,
  ringSize = 100,
  description,
  className = '',
}: ScoreCardProps) {
  return (
    <Card variant="interactive" className={className}>
      <div className="flex flex-col items-center gap-3">
        <ProgressRing score={score} size={ringSize} />
        <div className="text-center">
          <h3 className="text-sm font-semibold text-[var(--pq-text-primary)]">
            {label}
          </h3>
          {description && (
            <p className="text-xs text-[var(--pq-text-muted)] mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
