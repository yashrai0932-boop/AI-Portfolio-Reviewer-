// ============================================
// ProtfoliQ – Type Definitions
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  githubUsername: string;
  joinedAt: string;
}

export interface ScoreBreakdown {
  codeQuality: number;
  documentation: number;
  architecture: number;
  security: number;
  productionReadiness: number;
  professionalism: number;
}

export interface PortfolioScore {
  overall: number;
  letterGrade: string;
  breakdown: ScoreBreakdown;
  githubHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  scores: {
    codeQuality: number;
    documentation: number;
    architecture: number;
    security: number;
    productionReadiness: number;
    completeness: number;
  };
  issues: string[];
  strengths: string[];
}

export interface Skill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'cloud' | 'database' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  demonstrated: boolean;
}

export interface SkillSet {
  detected: Skill[];
  missing: Skill[];
}

export interface RecruiterSignal {
  type: 'positive' | 'negative';
  text: string;
  impact: 'high' | 'medium' | 'low';
}

export interface RecruiterView {
  firstImpression: string;
  overallSentiment: 'strong' | 'average' | 'weak';
  signals: RecruiterSignal[];
  recruiterScore: number;
  timeline: {
    label: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface BenchmarkEntry {
  label: string;
  score: number;
  color: string;
}

export interface BenchmarkData {
  overall: BenchmarkEntry[];
  categories: {
    category: string;
    entries: BenchmarkEntry[];
  }[];
  percentile: number;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: string;
}

export interface RoastQuote {
  id: string;
  text: string;
  category: string;
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file?: string;
}

export interface DocumentationCheck {
  item: string;
  present: boolean;
  quality?: 'good' | 'needs-improvement' | 'missing';
}

export interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
}

export interface AnalysisReport {
  id: string;
  repositoryName: string;
  repositoryUrl: string;
  analyzedAt: string;
  portfolioScore: PortfolioScore;
  repositories: Repository[];
  skills: SkillSet;
  recruiterView: RecruiterView;
  benchmarks: BenchmarkData;
  recommendations: Recommendation[];
  roasts: RoastQuote[];
  securityIssues: SecurityIssue[];
  documentationChecks: DocumentationCheck[];
}

export interface AnalysisHistory {
  id: string;
  repositoryName: string;
  score: number;
  date: string;
  status: 'complete' | 'in-progress' | 'failed';
}

export type ScoreLevel = 'excellent' | 'good' | 'average' | 'poor';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 55) return 'average';
  return 'poor';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--pq-success)';
  if (score >= 75) return 'var(--pq-accent-400)';
  if (score >= 55) return 'var(--pq-warning)';
  return 'var(--pq-danger)';
}

export function getLetterGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 60) return 'B-';
  if (score >= 55) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 40) return 'C-';
  return 'D';
};
