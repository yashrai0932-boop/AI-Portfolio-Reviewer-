'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { getProfile } from '../lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProfileData = Record<string, any>;

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { window.location.href = '/login'; return; }
    (async () => {
      try {
        const result = await getProfile() as ProfileData;
        setData(result);
      } catch (err) {
        console.error('Failed to load profile:', err);
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

  const analysisHistory = data?.analysis_history || [];
  const displayName = data?.first_name
    ? `${data.first_name} ${data.last_name || ''}`.trim()
    : data?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const githubUsername = data?.profile?.github_username || '';
  const joinedDate = data?.profile?.created_at
    ? new Date(data.profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : '';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--pq-text-primary)]">Profile & Settings</h1>
          <p className="mt-1 text-[var(--pq-text-muted)]">Manage your account and view analysis history.</p>
        </div>

        {/* User Info */}
        <Card variant="highlighted" padding="lg" className="mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-[var(--pq-primary-600)]/25">
              {initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-[var(--pq-text-primary)]">{displayName}</h2>
              <p className="text-sm text-[var(--pq-text-muted)]">{data?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="primary" size="md" dot>Member</Badge>
                {joinedDate && <Badge variant="default" size="md">Joined {joinedDate}</Badge>}
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={async () => { await logout(); window.location.href = '/'; }}>
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Connected GitHub */}
        {githubUsername && (
          <Card variant="default" padding="lg" className="mb-6">
            <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Connected GitHub
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--pq-bg-overlay)] border border-[var(--pq-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--pq-bg-subtle)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--pq-text-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--pq-text-primary)]">@{githubUsername}</p>
                  <p className="text-xs text-[var(--pq-text-muted)]">Connected via OAuth</p>
                </div>
              </div>
              <Badge variant="success" size="sm" dot>Connected</Badge>
            </div>
          </Card>
        )}

        {/* Analysis History */}
        <Card variant="default" padding="lg" className="mb-6">
          <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">Analysis History</h3>
          {analysisHistory.length > 0 ? (
            <div className="flex flex-col gap-2">
              {analysisHistory.map((item: ProfileData) => (
                <div
                  key={item.id}
                  onClick={() => item.status === 'complete' && (window.location.href = `/report?id=${item.id}`)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--pq-bg-overlay)]/50 hover:bg-[var(--pq-bg-overlay)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--pq-primary-600)]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[var(--pq-primary-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--pq-text-primary)]">{item.github_url?.replace('https://github.com/', '')}</p>
                      <p className="text-xs text-[var(--pq-text-muted)]">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums" style={{ color: item.overall_score >= 80 ? 'var(--pq-success)' : item.overall_score >= 50 ? 'var(--pq-warning)' : 'var(--pq-danger)' }}>
                      {item.overall_score || '—'}
                    </span>
                    <Badge variant={item.status === 'complete' ? 'success' : item.status === 'failed' ? 'danger' : 'default'} size="sm">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--pq-text-muted)]">No analyses yet. <a href="/analyze" className="text-[var(--pq-primary-400)] hover:underline">Run one now →</a></p>
          )}
        </Card>

        {/* Stats */}
        <Card variant="default" padding="lg">
          <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4">Account Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-[var(--pq-bg-overlay)]">
              <p className="text-2xl font-bold text-[var(--pq-primary-400)]">{data?.total_reports || 0}</p>
              <p className="text-xs text-[var(--pq-text-muted)] mt-1">Total Analyses</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--pq-bg-overlay)]">
              <p className="text-2xl font-bold text-[var(--pq-success)]">{analysisHistory.filter((a: ProfileData) => a.status === 'complete').length}</p>
              <p className="text-xs text-[var(--pq-text-muted)] mt-1">Completed</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--pq-bg-overlay)]">
              <p className="text-2xl font-bold text-[var(--pq-accent-400)]">{joinedDate || '—'}</p>
              <p className="text-xs text-[var(--pq-text-muted)] mt-1">Member Since</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
