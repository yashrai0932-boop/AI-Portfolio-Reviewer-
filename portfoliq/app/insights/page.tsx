'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { getInsights } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import ProgressRing from '../components/ui/ProgressRing';
import SignalList from '../components/ui/SignalList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InsightsData = Record<string, any>;

const insightsTabs = [
  { id: 'recruiter', label: 'Recruiter View' },
  { id: 'skills', label: 'Skill Intelligence' },
  { id: 'benchmarks', label: 'Benchmarking' },
];

function BenchmarkBar({ label, score, color, maxScore = 100 }: { label: string; score: number; color: string; maxScore?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--pq-text-muted)] w-24 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 h-7 rounded-lg bg-[var(--pq-bg-subtle)] overflow-hidden relative">
        <div className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-1000 ease-out" style={{ width: `${(score / maxScore) * 100}%`, background: color }}>
          <span className="text-xs font-bold text-white drop-shadow-sm">{score}</span>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { window.location.href = '/login'; return; }
    (async () => {
      try {
        const result = await getInsights() as InsightsData;
        setData(result);
      } catch {
        setError('No completed analysis found. Run an analysis first.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <svg className="w-10 h-10 text-[var(--pq-primary-400)] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-[var(--pq-text-primary)]">No Insights Yet</h1>
          <p className="mt-2 text-[var(--pq-text-muted)]">{error || 'Run an analysis to see insights.'}</p>
          <a href="/analyze" className="mt-6 inline-block text-[var(--pq-primary-400)] hover:underline">Go to Analyze →</a>
        </div>
      </DashboardLayout>
    );
  }

  const recruiterView = data.recruiter_view || {};
  const skills = data.skills || { detected: [], missing: [] };
  const benchmarks = data.benchmarks || {};

  const skillCategories = [
    { name: 'Languages', skills: (skills.detected || []).filter((s: InsightsData) => s.category === 'language') },
    { name: 'Frameworks', skills: (skills.detected || []).filter((s: InsightsData) => s.category === 'framework') },
    { name: 'Databases', skills: (skills.detected || []).filter((s: InsightsData) => s.category === 'database') },
    { name: 'Tools', skills: (skills.detected || []).filter((s: InsightsData) => s.category === 'tool') },
    { name: 'Other', skills: (skills.detected || []).filter((s: InsightsData) => !['language', 'framework', 'database', 'tool'].includes(s.category)) },
  ].filter((cat) => cat.skills.length > 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--pq-text-primary)]">
            Portfolio <span className="pq-gradient-text">Insights</span>
          </h1>
          <p className="mt-1 text-[var(--pq-text-muted)]">Advanced analytics, recruiter perspective, and industry benchmarks.</p>
        </div>

        <Tabs tabs={insightsTabs} defaultTab="recruiter">
          {(activeTab) => (
            <div>
              {activeTab === 'recruiter' && (
                <div className="flex flex-col gap-6">
                  <Card variant="highlighted" padding="lg">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <ProgressRing score={recruiterView.recruiter_score || 0} size={120} strokeWidth={10} label="Recruiter Score" />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-2">First Impression</h2>
                        <p className="text-sm text-[var(--pq-text-secondary)] leading-relaxed">{recruiterView.first_impression}</p>
                        <Badge variant={recruiterView.overall_sentiment === 'strong' ? 'success' : recruiterView.overall_sentiment === 'average' ? 'warning' : 'danger'} size="md" dot className="mt-3">
                          {(recruiterView.overall_sentiment || 'unknown').charAt(0).toUpperCase() + (recruiterView.overall_sentiment || 'unknown').slice(1)} Portfolio
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="default" padding="lg">
                      <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">✅ Positive Signals</h3>
                      <SignalList signals={recruiterView.signals || []} type="positive" />
                    </Card>
                    <Card variant="default" padding="lg">
                      <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">❌ Negative Signals</h3>
                      <SignalList signals={recruiterView.signals || []} type="negative" />
                    </Card>
                  </div>

                  {recruiterView.timeline?.length > 0 && (
                    <Card variant="default" padding="lg">
                      <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-6">What Recruiters See First</h3>
                      <div className="relative">
                        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-[var(--pq-border)]" />
                        <div className="flex flex-col gap-6">
                          {recruiterView.timeline.map((step: InsightsData, i: number) => (
                            <div key={i} className="flex items-start gap-4 relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                                step.sentiment === 'positive' ? 'bg-[var(--pq-success)]/10 border-[var(--pq-success)]/30 text-[var(--pq-success)]'
                                : step.sentiment === 'negative' ? 'bg-[var(--pq-danger)]/10 border-[var(--pq-danger)]/30 text-[var(--pq-danger)]'
                                : 'bg-[var(--pq-bg-subtle)] border-[var(--pq-border)] text-[var(--pq-text-muted)]'}`}>
                                <span className="text-xs font-bold">{i + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[var(--pq-text-primary)]">{step.label}</p>
                                <p className="text-sm text-[var(--pq-text-muted)] mt-0.5">{step.description}</p>
                              </div>
                              <Badge variant={step.sentiment === 'positive' ? 'success' : step.sentiment === 'negative' ? 'danger' : 'default'} size="sm">{step.sentiment}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="flex flex-col gap-6">
                  <Card variant="default" padding="lg">
                    <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">Detected Skills</h2>
                    {skillCategories.map((cat) => (
                      <div key={cat.name} className="mb-6 last:mb-0">
                        <h3 className="text-sm font-medium text-[var(--pq-text-muted)] mb-3">{cat.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((skill: InsightsData) => (
                            <div key={skill.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--pq-bg-overlay)] border border-[var(--pq-border)]">
                              <span className="text-sm font-medium text-[var(--pq-text-primary)]">{skill.name}</span>
                              <Badge variant={skill.proficiency === 'advanced' ? 'success' : skill.proficiency === 'intermediate' ? 'accent' : 'default'} size="sm">{skill.proficiency}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Card>

                  {skills.missing?.length > 0 && (
                    <Card variant="default" padding="lg">
                      <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-2">Missing Skills</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {skills.missing.map((skill: InsightsData) => (
                          <div key={skill.name} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--pq-warning)]/5 border border-[var(--pq-warning)]/10">
                            <span className="text-sm font-medium text-[var(--pq-text-primary)]">{skill.name}</span>
                            <span className="text-xs text-[var(--pq-warning)]">Not demonstrated</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'benchmarks' && (
                <div className="flex flex-col gap-6">
                  {benchmarks.overall && (
                    <Card variant="highlighted" padding="lg">
                      <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">Overall Comparison</h2>
                      <div className="flex flex-col gap-3">
                        {benchmarks.overall.map((entry: InsightsData) => (
                          <BenchmarkBar key={entry.label} label={entry.label} score={entry.score} color={entry.color} />
                        ))}
                      </div>
                      {benchmarks.percentile && (
                        <div className="mt-6 p-4 rounded-xl bg-[var(--pq-primary-600)]/5 border border-[var(--pq-primary-600)]/10">
                          <p className="text-sm text-[var(--pq-primary-300)]">
                            📊 You&apos;re in the <span className="font-bold">{benchmarks.percentile}th percentile</span> of all analyzed portfolios.
                          </p>
                        </div>
                      )}
                    </Card>
                  )}

                  {benchmarks.categories?.map((cat: InsightsData) => (
                    <Card key={cat.category} variant="default" padding="lg">
                      <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">{cat.category}</h3>
                      <div className="flex flex-col gap-2.5">
                        {cat.entries.map((entry: InsightsData) => (
                          <BenchmarkBar key={entry.label} label={entry.label} score={entry.score} color={entry.color} />
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
