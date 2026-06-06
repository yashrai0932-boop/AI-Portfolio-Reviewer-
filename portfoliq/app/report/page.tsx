'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { getReport } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';
import ProgressBar from '../components/ui/ProgressBar';
import SignalList from '../components/ui/SignalList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportData = Record<string, any>;

// ── File Tree Renderer ──────────────────────────────
function FileTreeNode({ item, isLast }: { item: { path: string; type: string; description: string }; isLast: boolean }) {
  const depth = item.path.split('/').length - 1;
  const paddingLeft = depth * 20;
  const connector = isLast ? '└── ' : '├── ';
  const icon = item.type === 'folder' ? '📁' : '📄';

  return (
    <div className="flex items-start gap-0 hover:bg-[var(--pq-bg-base)]/30 transition-colors group">
      <div className="flex items-center py-2 pl-3 flex-shrink-0" style={{ paddingLeft: `${paddingLeft + 12}px` }}>
        <span className="text-[var(--pq-text-muted)] font-mono text-xs whitespace-pre select-none">{connector}</span>
        <span className="mr-1.5 text-sm">{icon}</span>
        <span className="text-sm font-mono text-[var(--pq-primary-400)] font-medium">{item.path.split('/').pop()}</span>
      </div>
      <div className="flex-1 py-2 pr-3 min-w-0">
        <span className="text-xs text-[var(--pq-text-muted)] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
          {item.description}
        </span>
      </div>
    </div>
  );
}

function ReportPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, isLoading: authLoading } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openRepos, setOpenRepos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { window.location.href = '/login'; return; }
    if (!id) { setLoading(false); return; }
    (async () => {
      try {
        const data = await getReport(Number(id)) as ReportData;
        setReport(data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, authLoading]);

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

  if (!report) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-[var(--pq-text-muted)]">Report not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const breakdown = report.score_breakdown || {};
  const repos = report.repositories || [];
  const recommendations = report.recommendations || [];
  const securityIssues = report.security_issues || [];
  const docChecks = report.documentation_checks || [];
  const prodChecks = report.production_checks || [];
  const detectedSkills = report.detected_skills || [];
  const missingSkills = report.missing_skills || [];
  const roasts = report.roasts || [];
  const timeline = report.recruiter_timeline || [];
  const benchmarks = report.benchmarks || {};
  const profile = report.github_profile || {};

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* ── Hero Score ── */}
        <Card variant="highlighted" padding="lg" className="mb-8" glow>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <ProgressRing score={report.overall_score} size={180} strokeWidth={14} />
              <div className="mt-3 text-center">
                <span className="text-5xl font-bold pq-gradient-text">{report.letter_grade}</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--pq-text-primary)]">Portfolio Report</h1>
              <p className="text-sm text-[var(--pq-text-muted)] mt-1">
                {report.github_url?.replace('https://github.com/', '')} • Analyzed {new Date(report.created_at).toLocaleDateString()}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(breakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-2xl font-bold tabular-nums" style={{ color: Number(value) >= 80 ? 'var(--pq-success)' : Number(value) >= 50 ? 'var(--pq-warning)' : 'var(--pq-danger)' }}>
                      {String(value)}
                    </p>
                    <p className="text-xs text-[var(--pq-text-muted)] mt-0.5 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Strengths & Weaknesses ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card variant="default" padding="lg">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--pq-success)]" /> Strengths
            </h2>
            <ul className="flex flex-col gap-2.5">
              {(report.strengths || []).map((item: string) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-[var(--pq-success)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--pq-text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card variant="default" padding="lg">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--pq-danger)]" /> Weaknesses
            </h2>
            <ul className="flex flex-col gap-2.5">
              {(report.weaknesses || []).map((item: string) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-[var(--pq-danger)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--pq-text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ── Recruiter Impression ── */}
        {report.first_impression && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-4">👤 Recruiter Impression</h2>
            <p className="text-sm text-[var(--pq-text-secondary)] leading-relaxed mb-6">{report.first_impression}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--pq-success)] mb-3">Positive Signals</h3>
                <SignalList signals={report.recruiter_signals || []} type="positive" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--pq-danger)] mb-3">Negative Signals</h3>
                <SignalList signals={report.recruiter_signals || []} type="negative" />
              </div>
            </div>
          </Card>
        )}

        {/* ── Recruiter Timeline ── */}
        {timeline.length > 0 && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">⏱️ What Recruiters See First</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--pq-primary-500)] via-[var(--pq-warning)] to-[var(--pq-danger)]" />
              <div className="flex flex-col gap-4">
                {timeline.map((step: ReportData, i: number) => (
                  <div key={i} className="relative flex items-start gap-4 pl-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                      step.sentiment === 'positive' ? 'bg-[var(--pq-success)]/15 text-[var(--pq-success)] border border-[var(--pq-success)]/30' :
                      step.sentiment === 'negative' ? 'bg-[var(--pq-danger)]/15 text-[var(--pq-danger)] border border-[var(--pq-danger)]/30' :
                      'bg-[var(--pq-warning)]/15 text-[var(--pq-warning)] border border-[var(--pq-warning)]/30'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[var(--pq-text-primary)]">{step.label}</span>
                        <Badge variant={step.sentiment === 'positive' ? 'success' : step.sentiment === 'negative' ? 'danger' : 'warning'} size="sm">{step.sentiment}</Badge>
                      </div>
                      <p className="text-xs text-[var(--pq-text-muted)] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ── Repository Breakdown ── */}
        {repos.length > 0 && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">Repository Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo: ReportData) => (
                <div key={repo.id} className="p-4 rounded-xl border border-[var(--pq-border)] hover:border-[var(--pq-border-hover)] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--pq-text-primary)]">{repo.name}</h4>
                      <p className="text-xs text-[var(--pq-text-muted)] line-clamp-1">{repo.description}</p>
                    </div>
                    <Badge variant="primary" size="sm">{repo.language || '?'}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <ProgressBar value={repo.scores?.codeQuality || 0} label="Code" size="sm" />
                    <ProgressBar value={repo.scores?.documentation || 0} label="Docs" size="sm" />
                    <ProgressBar value={repo.scores?.completeness || 0} label="Complete" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Architecture & File Tree (Accordion) ── */}
        {repos.some((repo: ReportData) => repo.file_tree_definitions?.length > 0) && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">🌳 Architecture & File Tree</h2>
            <div className="flex flex-col gap-3">
              {repos.map((repo: ReportData) => {
                if (!repo.file_tree_definitions?.length) return null;
                const isOpen = openRepos[repo.id] || false;
                return (
                  <div key={repo.id} className="border border-[var(--pq-border)] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenRepos(prev => ({ ...prev, [repo.id]: !prev[repo.id] }))}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--pq-bg-overlay)] hover:bg-[var(--pq-bg-subtle)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">📦</span>
                        <h3 className="text-sm font-semibold text-[var(--pq-primary-300)]">{repo.name}</h3>
                        <Badge variant="primary" size="sm">{repo.file_tree_definitions.length} files</Badge>
                      </div>
                      <svg className={`w-4 h-4 text-[var(--pq-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="bg-[var(--pq-bg-base)] font-mono text-sm border-t border-[var(--pq-border)]">
                        {repo.file_tree_definitions.map((file: { path: string; type: string; description: string }, i: number) => (
                          <FileTreeNode key={i} item={file} isLast={i === repo.file_tree_definitions.length - 1} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── Security Audit ── */}
        <Card variant="default" padding="lg" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)]">🔒 Security Audit</h2>
            <Badge variant={securityIssues.length > 0 ? 'warning' : 'success'} size="md" dot>
              {securityIssues.length} issues found
            </Badge>
          </div>
          {securityIssues.length > 0 ? (
            <div className="flex flex-col gap-3">
              {securityIssues.map((issue: ReportData, i: number) => (
                <div key={i} className={`p-4 rounded-lg border ${issue.severity === 'critical' ? 'bg-[var(--pq-danger)]/5 border-[var(--pq-danger)]/20' : issue.severity === 'high' ? 'bg-[var(--pq-warning)]/5 border-[var(--pq-warning)]/20' : 'bg-[var(--pq-bg-overlay)] border-[var(--pq-border)]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={issue.severity === 'critical' ? 'danger' : issue.severity === 'high' ? 'warning' : 'default'} size="sm" dot>{issue.severity}</Badge>
                    <span className="text-sm font-semibold text-[var(--pq-text-primary)]">{issue.title}</span>
                  </div>
                  <p className="text-sm text-[var(--pq-text-muted)] mt-1">{issue.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--pq-success)]">No security issues detected! 🎉</p>
          )}
        </Card>

        {/* ── Documentation Checks ── */}
        {docChecks.length > 0 && (
          <Card variant="default" padding="lg" className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ProgressRing score={breakdown.documentation || 0} size={80} strokeWidth={6} />
              <div>
                <h2 className="text-lg font-semibold text-[var(--pq-text-primary)]">📖 Documentation Checks</h2>
                <p className="text-sm text-[var(--pq-text-muted)]">{docChecks.filter((c: ReportData) => c.present).length}/{docChecks.length} checks passed</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {docChecks.map((check: ReportData) => (
                <div key={check.item} className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${check.present ? 'bg-[var(--pq-success)]/5' : 'bg-[var(--pq-danger)]/5'}`}>
                  <div className="flex items-center gap-3">
                    {check.present ? (
                      <svg className="w-4 h-4 text-[var(--pq-success)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-[var(--pq-danger)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                    <span className="text-sm text-[var(--pq-text-primary)]">{check.item}</span>
                  </div>
                  {check.quality && <Badge variant={check.quality === 'good' ? 'success' : check.quality === 'needs-improvement' ? 'warning' : 'danger'} size="sm">{check.quality}</Badge>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Production Readiness ── */}
        {prodChecks.length > 0 && (
          <Card variant="default" padding="lg" className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ProgressRing score={breakdown.productionReadiness || 0} size={80} strokeWidth={6} />
              <div>
                <h2 className="text-lg font-semibold text-[var(--pq-text-primary)]">⚙️ Production Readiness</h2>
                <p className="text-sm text-[var(--pq-text-muted)]">How industry-ready are your projects?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prodChecks.map((item: ReportData) => (
                <div key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${item.has ? 'bg-[var(--pq-success)]/5' : 'bg-[var(--pq-danger)]/5'}`}>
                  {item.has ? (
                    <svg className="w-5 h-5 text-[var(--pq-success)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-[var(--pq-danger)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  )}
                  <span className="text-sm text-[var(--pq-text-primary)]">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Skills ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card variant="default" padding="lg">
            <h2 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">✅ Detected Skills</h2>
            <div className="flex flex-wrap gap-2">
              {detectedSkills.map((skill: ReportData) => (
                <Badge key={skill.name} variant={skill.category === 'language' ? 'primary' : skill.category === 'framework' ? 'accent' : skill.category === 'database' ? 'success' : 'default'} size="md">
                  {skill.name}
                </Badge>
              ))}
              {detectedSkills.length === 0 && <p className="text-sm text-[var(--pq-text-muted)]">No skills detected yet.</p>}
            </div>
          </Card>
          <Card variant="default" padding="lg">
            <h2 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">⚠️ Missing Skills</h2>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill: ReportData) => (
                <Badge key={skill.name} variant="outline" size="md">{skill.name}</Badge>
              ))}
              {missingSkills.length === 0 && <p className="text-sm text-[var(--pq-success)]">No missing skills! 🎉</p>}
            </div>
          </Card>
        </div>

        {/* ── Roast Section ── */}
        {roasts.length > 0 && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-4">🔥 Portfolio Roast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roasts.map((roast: ReportData, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--pq-bg-overlay)] border border-[var(--pq-border)]">
                  <span className="text-2xl flex-shrink-0">🔥</span>
                  <div>
                    <p className="text-sm text-[#fda4af] italic leading-relaxed">&ldquo;{roast.text}&rdquo;</p>
                    <Badge variant="danger" size="sm" className="mt-2">{roast.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Benchmarks ── */}
        {benchmarks.overall && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">📈 How You Compare</h2>
            <div className="flex flex-col gap-4 mb-6">
              {benchmarks.overall.map((entry: ReportData) => (
                <div key={entry.label} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--pq-text-secondary)] w-28 flex-shrink-0">{entry.label}</span>
                  <div className="flex-1 h-6 rounded-full bg-[var(--pq-bg-overlay)] overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${entry.score}%`, background: entry.color }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow">{entry.score}</span>
                  </div>
                </div>
              ))}
            </div>
            {benchmarks.percentile && (
              <p className="text-sm text-[var(--pq-text-muted)] text-center">
                You are in the <span className="text-[var(--pq-primary-300)] font-bold">top {100 - benchmarks.percentile}%</span> of student portfolios.
              </p>
            )}
          </Card>
        )}

        {/* ── Action Plan ── */}
        {recommendations.length > 0 && (
          <Card variant="highlighted" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-4">📋 Action Plan</h2>
            <div className="flex flex-col gap-3">
              {recommendations.map((rec: ReportData, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--pq-bg-base)]/50 border border-[var(--pq-border)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--pq-primary-600)]/15 flex items-center justify-center text-[var(--pq-primary-400)] text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[var(--pq-text-primary)]">{rec.title}</h4>
                      <Badge variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'default'} size="sm">{rec.priority}</Badge>
                    </div>
                    <p className="text-xs text-[var(--pq-text-muted)] leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── GitHub Profile Card ── */}
        {profile.login && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-6">👤 GitHub Profile</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                className="w-24 h-24 rounded-2xl border-2 border-[var(--pq-border)] shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[var(--pq-text-primary)]">{profile.name || profile.login}</h3>
                <p className="text-sm text-[var(--pq-primary-400)] font-medium">@{profile.login}</p>
                {profile.bio && <p className="text-sm text-[var(--pq-text-secondary)] mt-2 leading-relaxed">{profile.bio}</p>}

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 justify-center sm:justify-start">
                  {profile.location && (
                    <span className="flex items-center gap-1.5 text-xs text-[var(--pq-text-muted)]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {profile.location}
                    </span>
                  )}
                  {profile.company && (
                    <span className="flex items-center gap-1.5 text-xs text-[var(--pq-text-muted)]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" /></svg>
                      {profile.company}
                    </span>
                  )}
                  {profile.blog && (
                    <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[var(--pq-primary-400)] hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                      {profile.blog}
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-xs text-[var(--pq-primary-400)] hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {profile.email}
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[var(--pq-primary-400)] hover:underline">
                      @{profile.twitter_username}
                    </a>
                  )}
                </div>

                <div className="flex gap-6 mt-4 justify-center sm:justify-start">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[var(--pq-text-primary)]">{profile.public_repos}</p>
                    <p className="text-xs text-[var(--pq-text-muted)]">Repos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[var(--pq-text-primary)]">{profile.followers}</p>
                    <p className="text-xs text-[var(--pq-text-muted)]">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[var(--pq-text-primary)]">{profile.following}</p>
                    <p className="text-xs text-[var(--pq-text-muted)]">Following</p>
                  </div>
                  {profile.created_at && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-[var(--pq-text-primary)]">{new Date(profile.created_at).getFullYear()}</p>
                      <p className="text-xs text-[var(--pq-text-muted)]">Joined</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub Contribution Graph */}
            <div className="mt-8 pt-6 border-t border-[var(--pq-border)]">
              <h4 className="text-sm font-semibold text-[var(--pq-text-secondary)] mb-4">Contributions in the last year</h4>
              <div className="w-full overflow-x-auto pb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://ghchart.rshah.org/10b981/${profile.login}`} 
                  alt={`${profile.login}'s GitHub contribution chart`}
                  className="min-w-[700px] w-full h-auto opacity-90"
                />
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="primary" onClick={() => window.print()}>
            Download Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--pq-bg-deep)]" />}>
      <ReportPageContent />
    </Suspense>
  );
}
