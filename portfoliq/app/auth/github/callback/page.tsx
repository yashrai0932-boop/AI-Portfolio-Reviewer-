'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginWithGitHub } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';

function GitHubCallbackInner() {
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received from GitHub');
      return;
    }

    (async () => {
      try {
        await loginWithGitHub(code);
        await refreshUser();
        window.location.href = '/dashboard';
      } catch (err) {
        setError('Failed to authenticate with GitHub. Please try again.');
        console.error(err);
      }
    })();
  }, [searchParams, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pq-bg-deep)]">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pq-danger)]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--pq-danger)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[var(--pq-danger)] font-medium">{error}</p>
            <a href="/login" className="mt-4 inline-block text-sm text-[var(--pq-primary-400)] hover:underline">
              Back to Login
            </a>
          </>
        ) : (
          <>
            <svg className="w-12 h-12 mx-auto mb-4 text-[var(--pq-primary-400)] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-[var(--pq-text-muted)]">Authenticating with GitHub...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--pq-bg-deep)]">
          <svg className="w-12 h-12 text-[var(--pq-primary-400)] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }
    >
      <GitHubCallbackInner />
    </Suspense>
  );
}
