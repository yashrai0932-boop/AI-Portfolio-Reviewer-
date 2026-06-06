'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth';

interface NavbarProps {
  variant?: 'landing' | 'app';
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || '';
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = variant === 'landing';

  const navLinks = isLanding
    ? [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#demo', label: 'Demo' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/analyze', label: 'Analyze' },
        { href: '/insights', label: 'Insights' },
      ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled || !isLanding
            ? 'pq-glass-strong shadow-lg shadow-black/20'
            : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isLanding ? '/' : '/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center shadow-lg shadow-[var(--pq-primary-600)]/30 group-hover:shadow-[var(--pq-primary-600)]/50 transition-shadow">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[var(--pq-text-primary)] tracking-tight">
              Portfoli<span className="text-[var(--pq-primary-400)]">Q</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    pathname === link.href
                      ? 'text-[var(--pq-primary-300)] bg-[var(--pq-primary-600)]/10'
                      : 'text-[var(--pq-text-secondary)] hover:text-[var(--pq-text-primary)] hover:bg-[var(--pq-bg-overlay)]'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User */}
          <div className="hidden md:flex items-center gap-3">
            {isLanding && !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--pq-text-secondary)] hover:text-[var(--pq-text-primary)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] shadow-lg shadow-[var(--pq-primary-600)]/20 hover:shadow-xl hover:shadow-[var(--pq-primary-600)]/30 hover:scale-[1.02] transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            ) : isLanding && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] shadow-lg shadow-[var(--pq-primary-600)]/20 hover:shadow-xl hover:shadow-[var(--pq-primary-600)]/30 hover:scale-[1.02] transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[var(--pq-bg-overlay)] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[var(--pq-text-secondary)]">
                  {displayName}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--pq-text-secondary)] hover:text-[var(--pq-text-primary)] hover:bg-[var(--pq-bg-overlay)] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--pq-border)] mt-2 pt-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-[var(--pq-text-secondary)] hover:text-[var(--pq-text-primary)] hover:bg-[var(--pq-bg-overlay)] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isLanding ? (
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--pq-border)]">
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-sm font-medium text-center text-[var(--pq-text-secondary)] hover:text-[var(--pq-text-primary)] rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 text-sm font-medium text-center text-white rounded-xl bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)]"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 mt-3 pt-3 border-t border-[var(--pq-border)]"
                onClick={() => setMobileOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[var(--pq-text-secondary)]">
                  {displayName}
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
