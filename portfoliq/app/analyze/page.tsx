'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { analyzePortfolio, getReportStatus, getReport } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import ProgressRing from '../components/ui/ProgressRing';
import Tabs from '../components/ui/Tabs';

const analysisTabs = [
  { id: 'code', label: 'Code Quality' },
  { id: 'docs', label: 'Documentation' },
  { id: 'security', label: 'Security' },
  { id: 'production', label: 'Production' },
  { id: 'skills', label: 'Skills' },
  { id: 'roast', label: '🔥 Roast' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportData = Record<string, any>;



export default function AnalyzePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<'input' | 'analyzing' | 'results'>('input');
  const [reportId, setReportId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [steps, setSteps] = useState<string[]>(['Fetching GitHub repositories...']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) window.location.href = '/login';
  }, [user, authLoading]);

  const runAnalysis = useCallback(async () => {
    if (!url.trim()) return;
    setError('');
    setPhase('analyzing');
    setSteps(['Fetching GitHub repositories...']);

    try {
      const result = await analyzePortfolio(url) as { id: number };
      setReportId(result.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      setPhase('input');
    }
  }, [url]);

  // Poll for analysis status
  useEffect(() => {
    if (phase !== 'analyzing' || !reportId) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await getReportStatus(reportId) as { status: string; error_message?: string; current_step?: string };
        
        if (status.current_step) {
          setSteps((prev) => {
            if (prev[prev.length - 1] !== status.current_step) {
              return [...prev, status.current_step!];
            }
            return prev;
          });
        }

        if (status.status === 'complete') {
          clearInterval(pollInterval);
          setSteps((prev) => {
            if (prev[prev.length - 1] !== 'Analysis complete!') return [...prev, 'Analysis complete!'];
            return prev;
          });
          // Fetch the full report
          const fullReport = await getReport(reportId) as ReportData;
          setReportData(fullReport);
          setTimeout(() => setPhase('results'), 500);
        } else if (status.status === 'failed') {
          clearInterval(pollInterval);
          setError(status.error_message || 'Analysis failed');
          setPhase('input');
        }
      } catch {
        // Ignore polling errors
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [phase, reportId]);

  const repos = reportData?.repositories || [];
  const breakdown = reportData?.score_breakdown || {};
  const securityIssues = reportData?.security_issues || [];
  const docChecks = reportData?.documentation_checks || [];
  const prodChecks = reportData?.production_checks || [];
  const detectedSkills = reportData?.detected_skills || [];
  const missingSkills = reportData?.missing_skills || [];
  const roasts = reportData?.roasts || [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--pq-text-primary)]">Analyze Portfolio</h1>
          <p className="mt-1 text-[var(--pq-text-muted)]">Enter a GitHub profile or repository URL to start.</p>
        </div>

        {/* URL Input */}
        <Card variant="default" padding="lg" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="https://github.com/username or https://github.com/username/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>}
              />
            </div>
            <Button variant="primary" size="md" onClick={runAnalysis} isLoading={phase === 'analyzing'} disabled={!url.trim()}>
              {phase === 'analyzing' ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          {error && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--pq-danger)]/10 border border-[var(--pq-danger)]/20">
              <p className="text-sm text-[var(--pq-danger)]">{error}</p>
            </div>
          )}
        </Card>

        {/* Analysis Progress */}
        {phase === 'analyzing' && (
          <Card variant="highlighted" padding="lg" className="mb-6 pq-animate-fade-in">
            <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">Analysis in Progress</h3>
            <p className="text-sm text-[var(--pq-text-muted)] mb-4">This may take 30-60 seconds depending on the number of repositories...</p>
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1 && phase === 'analyzing' && step !== 'Analysis complete!';
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    !isLast ? 'bg-[var(--pq-success)]/5' : 'bg-[var(--pq-primary-600)]/10'}`}>
                    {!isLast ? (
                      <svg className="w-5 h-5 text-[var(--pq-success)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[var(--pq-primary-400)] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${!isLast ? 'text-[var(--pq-success)]' : 'text-[var(--pq-primary-300)]'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Results */}
        {phase === 'results' && reportData && (
          <div className="pq-animate-fade-in-up">
            <Card variant="highlighted" padding="lg" className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ProgressRing score={reportData.overall_score} size={100} strokeWidth={8} />
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-bold text-[var(--pq-text-primary)]">Analysis Complete</h3>
                  <p className="text-sm text-[var(--pq-text-muted)] mt-1">
                    Analyzed {repos.length} repositories from {reportData.github_url?.replace('https://github.com/', '')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(breakdown).map(([key, value]) => (
                      <Badge key={key} variant={Number(value) >= 80 ? 'success' : Number(value) >= 65 ? 'warning' : 'danger'} size="sm">
                        {key.replace(/([A-Z])/g, ' $1').trim()}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Link href={`/report?id=${reportData.id}`}>
                  <Button variant="primary">Full Report →</Button>
                </Link>
              </div>
            </Card>

            <Tabs tabs={analysisTabs} defaultTab="code">
              {(activeTab) => (
                <div>
                  {activeTab === 'code' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {repos.map((repo: ReportData) => (
                        <Card key={repo.id} variant="default" padding="md">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-[var(--pq-text-primary)]">{repo.name}</h4>
                            <Badge variant="primary" size="sm">{repo.language || 'Unknown'}</Badge>
                          </div>
                          <ProgressBar value={repo.scores?.codeQuality || 0} label="Code Quality" className="mb-3" />
                          <ProgressBar value={repo.scores?.architecture || 0} label="Architecture" className="mb-3" />
                          {repo.strengths?.length > 0 && (
                            <div className="mt-3 flex flex-col gap-1.5">
                              {repo.strengths.slice(0, 2).map((s: string) => (
                                <div key={s} className="flex items-center gap-2 text-xs">
                                  <svg className="w-3.5 h-3.5 text-[var(--pq-success)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-[var(--pq-text-secondary)]">{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeTab === 'docs' && (
                    <Card variant="default" padding="lg">
                      <div className="flex items-center gap-3 mb-6">
                        <ProgressRing score={breakdown.documentation || 0} size={80} strokeWidth={6} />
                        <div>
                          <h4 className="text-lg font-semibold text-[var(--pq-text-primary)]">Documentation Score</h4>
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
                        {docChecks.length === 0 && <p className="text-sm text-[var(--pq-text-muted)]">No documentation checks available.</p>}
                      </div>
                    </Card>
                  )}

                  {activeTab === 'security' && (
                    <Card variant="default" padding="lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-[var(--pq-text-primary)]">Security Audit</h4>
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
                  )}

                  {activeTab === 'production' && (
                    <Card variant="default" padding="lg">
                      <div className="flex items-center gap-3 mb-6">
                        <ProgressRing score={breakdown.productionReadiness || 0} size={80} strokeWidth={6} />
                        <div>
                          <h4 className="text-lg font-semibold text-[var(--pq-text-primary)]">Production Readiness</h4>
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
                        {prodChecks.length === 0 && <p className="text-sm text-[var(--pq-text-muted)]">No production checks available.</p>}
                      </div>
                    </Card>
                  )}

                  {activeTab === 'skills' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card variant="default" padding="lg">
                        <h4 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">✅ Detected Skills</h4>
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
                        <h4 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">⚠️ Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {missingSkills.map((skill: ReportData) => (
                            <Badge key={skill.name} variant="outline" size="md">{skill.name}</Badge>
                          ))}
                          {missingSkills.length === 0 && <p className="text-sm text-[var(--pq-success)]">No missing skills! 🎉</p>}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'roast' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roasts.map((roast: ReportData, i: number) => (
                        <Card key={i} variant="default" padding="md">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">🔥</span>
                            <div>
                              <p className="text-sm text-[#fda4af] italic leading-relaxed">&ldquo;{roast.text}&rdquo;</p>
                              <Badge variant="danger" size="sm" className="mt-2">{roast.category}</Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {roasts.length === 0 && (
                        <Card variant="default" padding="lg">
                          <p className="text-sm text-[var(--pq-text-muted)]">No roasts available. Your portfolio might actually be good! 😱</p>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
