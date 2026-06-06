'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../lib/auth';
import { getGitHubOAuthUrl } from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const isNative = Capacitor.isNativePlatform();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      try {
        const parsed = JSON.parse(message);
        setError(parsed?.non_field_errors?.[0] || parsed?.detail || 'Invalid email or password');
      } catch {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const { url } = await getGitHubOAuthUrl();
      window.location.href = url;
    } catch {
      setError('Failed to connect to GitHub. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--pq-bg-deep)]">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pq-grid-bg" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--pq-primary-600)]/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[var(--pq-accent-500)]/8 blur-[100px]" />

        <div className="relative z-10 max-w-md text-center px-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center shadow-lg shadow-[var(--pq-primary-600)]/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[var(--pq-text-primary)]">
              Portfoli<span className="text-[var(--pq-primary-400)]">Q</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-[var(--pq-text-primary)] leading-tight">
            Transform your portfolio into a
            <span className="pq-gradient-text"> recruiter magnet</span>
          </h1>
          <p className="mt-4 text-[var(--pq-text-secondary)] leading-relaxed">
            AI-powered analysis of your GitHub repositories, documentation, and project quality.
          </p>

          <div className="mt-10 p-4 rounded-xl bg-[var(--pq-bg-overlay)]/50 border border-[var(--pq-border)]">
            <p className="text-sm text-[var(--pq-text-muted)] italic">
              &ldquo;ProtfoliQ showed me exactly what recruiters see. My score went from 56 to 89 in two weeks.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--pq-primary-300)] font-medium">
              — Priya S., Software Engineering Intern @ Google
            </p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[var(--pq-text-primary)]">
                Portfoli<span className="text-[var(--pq-primary-400)]">Q</span>
              </span>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-[var(--pq-text-primary)]">Welcome back</h2>
            <p className="mt-2 text-sm text-[var(--pq-text-muted)]">
              Sign in to your account to continue.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--pq-danger)]/10 border border-[var(--pq-danger)]/20">
              <p className="text-sm text-[var(--pq-danger)]">{error}</p>
            </div>
          )}

          {/* GitHub OAuth - Hidden on Native Mobile */}
          {!isNative && (
            <>
              <button
                onClick={handleGitHubLogin}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-[var(--pq-bg-overlay)] border border-[var(--pq-border)] text-[var(--pq-text-primary)] text-sm font-medium hover:bg-[var(--pq-bg-subtle)] hover:border-[var(--pq-border-hover)] transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--pq-border)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs text-[var(--pq-text-muted)] bg-[var(--pq-bg-deep)]">
                    or sign in with email
                  </span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            <Button variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--pq-text-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--pq-primary-400)] hover:text-[var(--pq-primary-300)] font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
