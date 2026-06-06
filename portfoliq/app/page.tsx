'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Card from './components/ui/Card';
import ProgressRing from './components/ui/ProgressRing';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    title: 'GitHub Audit & Security',
    description: 'Deep audit of code quality, security vulnerabilities, and engineering practices across all your GitHub repositories.',
    color: 'var(--pq-primary-400)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    title: 'Architecture & File Tree',
    description: 'Automatically generate a visual file tree and architecture breakdown to showcase how well your projects are structured.',
    color: 'var(--pq-accent-400)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Presentation Preview',
    description: 'Preview how your portfolio appears to recruiters — README quality, setup docs, screenshots, and presentation polish.',
    color: 'var(--pq-success)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Recruiter Timeline',
    description: 'See exactly what recruiters notice first with a 0-60 second impression timeline. Get positive and negative signals with actionable fixes.',
    color: 'var(--pq-warning)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    title: 'Production Readiness',
    description: 'Check if your projects are industry-ready with automated checks for Docker, CI/CD pipelines, and proper dependency management.',
    color: 'var(--pq-info)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Roasts & Benchmarks',
    description: 'Get brutally honest, witty AI feedback on your portfolio. Then see how you stack up against average students, interns, and industry pros.',
    color: 'var(--pq-danger)',
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect GitHub',
    description: 'Paste your GitHub profile or repository URL to get started.',
  },
  {
    step: '02',
    title: 'AI Analyzes',
    description: 'Our AI agents audit code quality, documentation, security, and more.',
  },
  {
    step: '03',
    title: 'Get Your Score',
    description: 'Receive a comprehensive portfolio score with detailed breakdowns.',
  },
  {
    step: '04',
    title: 'Improve & Impress',
    description: 'Follow actionable recommendations to level up your portfolio.',
  },
];

const stats = [
  { value: '30+', label: 'Portfolios Analyzed' },
  { value: '150+', label: 'Repos Scanned' },
  { value: '94%', label: 'Improved Scores' },
  { value: '4.9★', label: 'User Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--pq-bg-deep)]">
      <Navbar variant="landing" />

      {/* ======================== HERO ======================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 pq-grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--pq-primary-600)]/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--pq-accent-500)]/6 blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--pq-primary-600)]/10 border border-[var(--pq-primary-600)]/20 text-sm text-[var(--pq-primary-300)] font-medium mb-6 pq-animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[var(--pq-success)] animate-pulse" />
                AI-Powered Portfolio Reviews
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight pq-animate-fade-in-up">
                <span className="text-[var(--pq-text-primary)]">Build Projects.</span>
                <br />
                <span className="pq-gradient-text">Prove Skills.</span>
                <br />
                <span className="text-[var(--pq-text-primary)]">Impress Recruiters.</span>
              </h1>

              <p className="mt-6 text-lg text-[var(--pq-text-secondary)] leading-relaxed max-w-lg mx-auto lg:mx-0 pq-animate-fade-in-up pq-delay-2">
                ProtfoliQ audits your GitHub portfolio from a recruiter&apos;s perspective and gives you actionable intelligence to stand out.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pq-animate-fade-in-up pq-delay-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-white rounded-xl bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] shadow-lg shadow-[var(--pq-primary-600)]/25 hover:shadow-xl hover:shadow-[var(--pq-primary-600)]/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  Get Started — Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-[var(--pq-text-secondary)] rounded-xl border border-[var(--pq-border)] hover:bg-[var(--pq-bg-overlay)] hover:border-[var(--pq-border-hover)] hover:text-[var(--pq-text-primary)] transition-all duration-200"
                >
                  See Demo
                </Link>
              </div>
            </div>

            {/* Right — Dashboard Preview */}
            <div className="relative pq-animate-scale-in pq-delay-4">
              <div className="relative pq-float">
                {/* Glow behind */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[var(--pq-primary-600)]/20 to-[var(--pq-accent-500)]/10 blur-2xl" />

                {/* Card */}
                <Card variant="glass" padding="lg" className="relative" glow>
                  <div className="flex rounded-full items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pq-primary-500)] to-[var(--pq-accent-500)] flex items-center justify-center text-white text-sm font-bold">
                      AC
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--pq-text-primary)]">Alex Chen</p>
                      <p className="text-xs text-[var(--pq-text-muted)]">@alexchen-dev</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-6">
                    <ProgressRing score={84} size={140} strokeWidth={10} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Code', score: 87 },
                      { label: 'Docs', score: 72 },
                      { label: 'Architecture', score: 89 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[var(--pq-bg-overlay)]/60"
                      >
                        <ProgressRing score={item.score} size={52} strokeWidth={4} />
                        <span className="text-xs text-[var(--pq-text-muted)]">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[var(--pq-danger)]/5 border border-[var(--pq-danger)]/10">
                    <p className="text-xs text-[var(--pq-text-muted)]">🔥 Latest Roast</p>
                    <p className="text-sm text-[#fda4af] mt-1 italic">
                      &ldquo;Your code is impressive. Your README is fighting against it.&rdquo;
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== STATS ======================== */}
      <section className="relative py-12 border-y border-[var(--pq-border)] bg-[var(--pq-bg-base)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold pq-gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm text-[var(--pq-text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--pq-text-primary)]">
              Everything You Need to
              <span className="pq-gradient-text"> Stand Out</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--pq-text-secondary)] max-w-2xl mx-auto">
              ProtfoliQ uses specialized AI agents to analyze every dimension of your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                variant="interactive"
                className={`pq-animate-fade-in-up pq-delay-${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--pq-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section id="how-it-works" className="relative py-24 sm:py-32 bg-[var(--pq-bg-base)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--pq-text-primary)]">
              How It <span className="pq-gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--pq-text-secondary)]">
              From GitHub URL to actionable intelligence in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className={`relative pq-animate-fade-in-up pq-delay-${i + 1}`}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-[var(--pq-primary-600)]/30 to-transparent" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[var(--pq-primary-600)]/25 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--pq-text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--pq-text-muted)] leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== DEMO PREVIEW ======================== */}
      <section id="demo" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 pq-grid-bg" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--pq-primary-600)]/5 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--pq-text-primary)]">
              See Your Portfolio <span className="pq-gradient-text">Through AI Eyes</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--pq-text-secondary)]">
              Here&apos;s what a typical analysis looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Positive Signals */}
            <Card variant="default" padding="lg">
              <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--pq-success)]" />
                Positive Signals
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  'Strong architecture across projects',
                  'Good project complexity and variety',
                  'Active development history',
                  'Clean, readable code',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-[var(--pq-success)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#6ee7b7]">{text}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Negative Signals */}
            <Card variant="default" padding="lg">
              <h3 className="text-base font-semibold text-[var(--pq-text-primary)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--pq-danger)]" />
                Needs Improvement
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  'No deployment/demo links',
                  'Inconsistent documentation quality',
                  'Missing testing in most projects',
                  'No CI/CD pipelines configured',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-[var(--pq-danger)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#fda4af]">{text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--pq-primary-900)]/20 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--pq-text-primary)]">
            Ready to Transform Your Portfolio?
          </h2>
          <p className="mt-4 text-lg text-[var(--pq-text-secondary)] max-w-xl mx-auto">
            Join thousands of students who improved their portfolios with ProtfoliQ. It&apos;s free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-[var(--pq-primary-600)] to-[var(--pq-primary-500)] shadow-xl shadow-[var(--pq-primary-600)]/25 hover:shadow-2xl hover:shadow-[var(--pq-primary-600)]/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              Get Started — It&apos;s Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
