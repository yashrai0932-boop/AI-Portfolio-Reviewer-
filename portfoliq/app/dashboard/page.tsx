'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { getDashboard } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import ProgressRing from '../components/ui/ProgressRing';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface DashboardData {
  latest_report: {
    id: number;
    overall_score: number;
    letter_grade: string;
    github_health: string;
    score_breakdown: Record<string, number>;
    roasts: Array<{ text: string; category: string }>;
    recommendations: Array<{ id?: number; priority: string; title: string; description: string }>;
  } | null;
  recent_analyses: Array<{
    id: number;
    github_url: string;
    status: string;
    overall_score: number;
    created_at: string;
  }>;
  total_reports: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    (async () => {
      try {
        const result = await getDashboard() as DashboardData;
        setData(result);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
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

  const report = data?.latest_report;
  const recentAnalyses = data?.recent_analyses || [];
  const userName = user?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--pq-text-primary)]">
            Welcome back, <span className="pq-gradient-text">{userName}</span> 👋
          </h1>
          <p className="mt-1 text-[var(--pq-text-muted)]">
            {report ? "Here's an overview of your portfolio health." : "Start by analyzing your GitHub portfolio."}
          </p>
        </div>

        {!report ? (
          /* Empty State */
          <Card variant="highlighted" padding="lg" className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] flex items-center justify-center text-white shadow-lg shadow-[var(--pq-primary-600)]/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--pq-text-primary)]">No analysis yet</h2>
            <p className="mt-2 text-sm text-[var(--pq-text-muted)] max-w-md mx-auto">
              Analyze your GitHub profile or a specific repository to get your portfolio score, recruiter insights, and improvement recommendations.
            </p>
            <Link href="/analyze">
              <Button variant="primary" size="lg" className="mt-6">Analyze My Portfolio</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Main Score + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card variant="highlighted" padding="lg" className="lg:row-span-2" glow>
                <div className="flex flex-col items-center text-center h-full justify-center">
                  <p className="text-sm font-medium text-[var(--pq-text-muted)] mb-4">Portfolio Score</p>
                  <ProgressRing score={report.overall_score} size={160} strokeWidth={12} />
                  <div className="mt-4">
                    <span className="text-4xl font-bold pq-gradient-text">{report.letter_grade}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--pq-text-muted)]">
                    GitHub Health: {report.github_health}
                  </p>
                  <Link href={`/report?id=${report.id}`}>
                    <Button variant="primary" size="sm" className="mt-4">View Full Report</Button>
                  </Link>
                </div>
              </Card>

              {Object.entries(report.score_breakdown).slice(0, 4).map(([key, value]) => {
                const colors: Record<string, { bg: string; text: string }> = {
                  codeQuality: { bg: 'var(--pq-success)', text: 'var(--pq-success)' },
                  documentation: { bg: 'var(--pq-accent-500)', text: 'var(--pq-accent-400)' },
                  productionReadiness: { bg: 'var(--pq-warning)', text: 'var(--pq-warning)' },
                  architecture: { bg: 'var(--pq-primary-500)', text: 'var(--pq-primary-400)' },
                  security: { bg: 'var(--pq-danger)', text: 'var(--pq-danger)' },
                  professionalism: { bg: 'var(--pq-accent-400)', text: 'var(--pq-accent-400)' },
                };
                const c = colors[key] || { bg: 'var(--pq-primary-500)', text: 'var(--pq-primary-400)' };
                const label = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <Card key={key} variant="default" padding="md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${c.bg} 10%, transparent)` }}>
                        <span className="text-lg font-bold" style={{ color: c.text }}>{value}</span>
                      </div>
                      <p className="text-sm text-[var(--pq-text-muted)] capitalize">{label}</p>
                    </div>
                    <ProgressBar value={value} label={label} size="sm" />
                  </Card>
                );
              })}
            </div>

            {/* Latest Roast + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {report.roasts?.length > 0 && (
                <Card variant="default" padding="lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🔥</span>
                    <h3 className="text-base font-semibold text-[var(--pq-text-primary)]">Latest Roast</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--pq-danger)]/5 border border-[var(--pq-danger)]/10">
                    <p className="text-sm text-[#fda4af] italic leading-relaxed">
                      &ldquo;{report.roasts[0].text}&rdquo;
                    </p>
                    <p className="mt-2 text-xs text-[var(--pq-text-muted)]">Category: {report.roasts[0].category}</p>
                  </div>
                </Card>
              )}

              {report.recommendations?.length > 0 && (
                <Card variant="default" padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-[var(--pq-text-primary)]">Top Recommendations</h3>
                    <Link href={`/report?id=${report.id}`}><Badge variant="primary" size="sm">View All</Badge></Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {report.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--pq-bg-overlay)]/50 hover:bg-[var(--pq-bg-overlay)] transition-colors">
                        <Badge variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'default'} size="sm" dot>{rec.priority}</Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--pq-text-primary)]">{rec.title}</p>
                          <p className="text-xs text-[var(--pq-text-muted)] mt-0.5 line-clamp-1">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Recent Analysis + Action Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card variant="default" padding="lg" className="lg:col-span-2">
                <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">Recent Analysis</h3>
                {recentAnalyses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--pq-border)]">
                          <th className="text-left text-xs font-medium text-[var(--pq-text-muted)] pb-3 pr-4">URL</th>
                          <th className="text-left text-xs font-medium text-[var(--pq-text-muted)] pb-3 pr-4">Score</th>
                          <th className="text-left text-xs font-medium text-[var(--pq-text-muted)] pb-3 pr-4">Date</th>
                          <th className="text-left text-xs font-medium text-[var(--pq-text-muted)] pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAnalyses.map((item) => (
                          <tr key={item.id} className="border-b border-[var(--pq-border)]/50 last:border-0 cursor-pointer hover:bg-[var(--pq-bg-overlay)]/30" onClick={() => item.status === 'complete' && (window.location.href = `/report?id=${item.id}`)}>
                            <td className="py-3 pr-4">
                              <span className="text-sm font-medium text-[var(--pq-text-primary)]">
                                {item.github_url.replace('https://github.com/', '')}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-sm font-bold tabular-nums" style={{ color: item.overall_score >= 80 ? 'var(--pq-success)' : item.overall_score >= 50 ? 'var(--pq-warning)' : 'var(--pq-danger)' }}>
                                {item.overall_score || '—'}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-sm text-[var(--pq-text-muted)]">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3">
                              <Badge variant={item.status === 'complete' ? 'success' : item.status === 'analyzing' ? 'accent' : item.status === 'failed' ? 'danger' : 'default'} size="sm" dot>
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--pq-text-muted)]">No analyses yet.</p>
                )}
              </Card>

              <div className="flex flex-col gap-4">
                <Link href="/analyze" className="block">
                  <Card variant="interactive" padding="md" className="group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] flex items-center justify-center text-white shadow-lg shadow-[var(--pq-primary-600)]/20 group-hover:shadow-xl transition-shadow">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                      </div>
                      <div><p className="text-sm font-semibold text-[var(--pq-text-primary)]">Analyze Portfolio</p><p className="text-xs text-[var(--pq-text-muted)]">Run a new analysis</p></div>
                    </div>
                  </Card>
                </Link>
                <Link href="/insights" className="block">
                  <Card variant="interactive" padding="md" className="group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--pq-warning)] to-[#f59e0b] flex items-center justify-center text-white shadow-lg shadow-[var(--pq-warning)]/20 group-hover:shadow-xl transition-shadow">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                      </div>
                      <div><p className="text-sm font-semibold text-[var(--pq-text-primary)]">Insights</p><p className="text-xs text-[var(--pq-text-muted)]">Recruiter view & benchmarks</p></div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
