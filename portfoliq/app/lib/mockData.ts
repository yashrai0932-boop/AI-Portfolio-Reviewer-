import type {
  User,
  PortfolioScore,
  Repository,
  SkillSet,
  RecruiterView,
  BenchmarkData,
  Recommendation,
  RoastQuote,
  SecurityIssue,
  DocumentationCheck,
  AnalysisReport,
  AnalysisHistory,
  AnalysisStep,
} from './types';

// ============================================
// User
// ============================================

export const mockUser: User = {
  id: 'u-001',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatarUrl: '',
  githubUsername: 'alexchen-dev',
  joinedAt: '2025-09-15',
};

// ============================================
// Portfolio Score
// ============================================

export const mockPortfolioScore: PortfolioScore = {
  overall: 84,
  letterGrade: 'B+',
  githubHealth: 'Good',
  breakdown: {
    codeQuality: 87,
    documentation: 72,
    architecture: 89,
    security: 78,
    productionReadiness: 70,
    professionalism: 85,
  },
};

// ============================================
// Repositories
// ============================================

export const mockRepositories: Repository[] = [
  {
    id: 'r-001',
    name: 'neural-style-transfer',
    description: 'Real-time neural style transfer using PyTorch with custom loss functions and a React frontend',
    url: 'https://github.com/alexchen-dev/neural-style-transfer',
    language: 'Python',
    stars: 48,
    forks: 12,
    lastUpdated: '2025-12-01',
    scores: {
      codeQuality: 91,
      documentation: 65,
      architecture: 88,
      security: 82,
      productionReadiness: 72,
      completeness: 78,
    },
    issues: [
      'Missing API documentation',
      'No deployment configuration',
      'Hardcoded model path in config',
    ],
    strengths: [
      'Clean modular architecture',
      'Good use of design patterns',
      'Comprehensive model evaluation',
      'Active development history',
    ],
  },
  {
    id: 'r-002',
    name: 'taskflow-app',
    description: 'Full-stack task management app with real-time collaboration using Next.js, Node.js, and MongoDB',
    url: 'https://github.com/alexchen-dev/taskflow-app',
    language: 'TypeScript',
    stars: 23,
    forks: 5,
    lastUpdated: '2025-11-20',
    scores: {
      codeQuality: 85,
      documentation: 80,
      architecture: 92,
      security: 75,
      productionReadiness: 78,
      completeness: 85,
    },
    issues: [
      'Missing unit tests for API routes',
      'No CI/CD pipeline configured',
      'Environment variables not fully documented',
    ],
    strengths: [
      'Excellent folder structure',
      'Real-time features implemented',
      'Responsive design',
      'Good README with screenshots',
    ],
  },
  {
    id: 'r-003',
    name: 'crypto-dashboard',
    description: 'Real-time cryptocurrency dashboard with price alerts and portfolio tracking',
    url: 'https://github.com/alexchen-dev/crypto-dashboard',
    language: 'JavaScript',
    stars: 15,
    forks: 3,
    lastUpdated: '2025-10-05',
    scores: {
      codeQuality: 78,
      documentation: 55,
      architecture: 82,
      security: 60,
      productionReadiness: 55,
      completeness: 65,
    },
    issues: [
      'API key exposed in client-side code',
      'No error boundaries',
      'Missing loading states',
      'README lacks setup instructions',
    ],
    strengths: [
      'Interesting project concept',
      'Good use of WebSocket',
      'Interactive charts',
    ],
  },
  {
    id: 'r-004',
    name: 'ml-pipeline-toolkit',
    description: 'Reusable ML pipeline components for data preprocessing, training, and evaluation',
    url: 'https://github.com/alexchen-dev/ml-pipeline-toolkit',
    language: 'Python',
    stars: 67,
    forks: 19,
    lastUpdated: '2025-12-10',
    scores: {
      codeQuality: 93,
      documentation: 88,
      architecture: 95,
      security: 90,
      productionReadiness: 82,
      completeness: 90,
    },
    issues: [
      'Could benefit from Docker support',
      'Missing contribution guidelines',
    ],
    strengths: [
      'Excellent code documentation',
      'Comprehensive test suite',
      'Clean API design',
      'Well-structured README',
      'Good use of type hints',
    ],
  },
];

// ============================================
// Skills
// ============================================

export const mockSkills: SkillSet = {
  detected: [
    { name: 'Python', category: 'language', proficiency: 'advanced', demonstrated: true },
    { name: 'TypeScript', category: 'language', proficiency: 'advanced', demonstrated: true },
    { name: 'JavaScript', category: 'language', proficiency: 'advanced', demonstrated: true },
    { name: 'React', category: 'framework', proficiency: 'advanced', demonstrated: true },
    { name: 'Next.js', category: 'framework', proficiency: 'intermediate', demonstrated: true },
    { name: 'Node.js', category: 'framework', proficiency: 'intermediate', demonstrated: true },
    { name: 'PyTorch', category: 'framework', proficiency: 'intermediate', demonstrated: true },
    { name: 'MongoDB', category: 'database', proficiency: 'intermediate', demonstrated: true },
    { name: 'TensorFlow', category: 'framework', proficiency: 'beginner', demonstrated: true },
    { name: 'Git', category: 'tool', proficiency: 'advanced', demonstrated: true },
    { name: 'OpenCV', category: 'framework', proficiency: 'intermediate', demonstrated: true },
    { name: 'REST APIs', category: 'other', proficiency: 'advanced', demonstrated: true },
  ],
  missing: [
    { name: 'Docker', category: 'tool', proficiency: 'beginner', demonstrated: false },
    { name: 'AWS', category: 'cloud', proficiency: 'beginner', demonstrated: false },
    { name: 'CI/CD', category: 'tool', proficiency: 'beginner', demonstrated: false },
    { name: 'Testing', category: 'tool', proficiency: 'beginner', demonstrated: false },
    { name: 'Kubernetes', category: 'tool', proficiency: 'beginner', demonstrated: false },
    { name: 'PostgreSQL', category: 'database', proficiency: 'beginner', demonstrated: false },
    { name: 'Redis', category: 'database', proficiency: 'beginner', demonstrated: false },
    { name: 'GraphQL', category: 'other', proficiency: 'beginner', demonstrated: false },
  ],
};

// ============================================
// Recruiter View
// ============================================

export const mockRecruiterView: RecruiterView = {
  firstImpression:
    'This portfolio demonstrates strong technical skills with a good mix of AI/ML and full-stack projects. The code quality is consistently above average. However, the lack of deployment links and inconsistent documentation may cause recruiters to move on quickly.',
  overallSentiment: 'strong',
  recruiterScore: 78,
  signals: [
    { type: 'positive', text: 'Strong architecture across projects', impact: 'high' },
    { type: 'positive', text: 'Good project complexity and variety', impact: 'high' },
    { type: 'positive', text: 'Active development history', impact: 'medium' },
    { type: 'positive', text: 'Clean, readable code', impact: 'medium' },
    { type: 'positive', text: 'Meaningful project descriptions', impact: 'medium' },
    { type: 'negative', text: 'No deployment/demo links', impact: 'high' },
    { type: 'negative', text: 'Inconsistent documentation quality', impact: 'high' },
    { type: 'negative', text: 'Missing testing in most projects', impact: 'medium' },
    { type: 'negative', text: 'No CI/CD pipelines configured', impact: 'medium' },
    { type: 'negative', text: 'Security vulnerabilities detected', impact: 'low' },
  ],
  timeline: [
    {
      label: '0-10 seconds',
      description: 'Recruiter sees profile overview & pinned repos',
      sentiment: 'positive',
    },
    {
      label: '10-30 seconds',
      description: 'Checks top repository README files',
      sentiment: 'neutral',
    },
    {
      label: '30-60 seconds',
      description: 'Looks for demo links and screenshots',
      sentiment: 'negative',
    },
    {
      label: '1-2 minutes',
      description: 'Reviews code quality in key files',
      sentiment: 'positive',
    },
    {
      label: '2-5 minutes',
      description: 'Evaluates project complexity and skills',
      sentiment: 'positive',
    },
  ],
};

// ============================================
// Benchmarks
// ============================================

export const mockBenchmarks: BenchmarkData = {
  overall: [
    { label: 'You', score: 84, color: 'var(--pq-primary-500)' },
    { label: 'Avg Student', score: 56, color: 'var(--pq-text-muted)' },
    { label: 'Internship Level', score: 72, color: 'var(--pq-warning)' },
    { label: 'Industry Level', score: 92, color: 'var(--pq-success)' },
  ],
  categories: [
    {
      category: 'Code Quality',
      entries: [
        { label: 'You', score: 87, color: 'var(--pq-primary-500)' },
        { label: 'Avg Student', score: 58, color: 'var(--pq-text-muted)' },
        { label: 'Internship', score: 70, color: 'var(--pq-warning)' },
        { label: 'Industry', score: 90, color: 'var(--pq-success)' },
      ],
    },
    {
      category: 'Documentation',
      entries: [
        { label: 'You', score: 72, color: 'var(--pq-primary-500)' },
        { label: 'Avg Student', score: 40, color: 'var(--pq-text-muted)' },
        { label: 'Internship', score: 65, color: 'var(--pq-warning)' },
        { label: 'Industry', score: 88, color: 'var(--pq-success)' },
      ],
    },
    {
      category: 'Architecture',
      entries: [
        { label: 'You', score: 89, color: 'var(--pq-primary-500)' },
        { label: 'Avg Student', score: 50, color: 'var(--pq-text-muted)' },
        { label: 'Internship', score: 68, color: 'var(--pq-warning)' },
        { label: 'Industry', score: 93, color: 'var(--pq-success)' },
      ],
    },
    {
      category: 'Production Readiness',
      entries: [
        { label: 'You', score: 70, color: 'var(--pq-primary-500)' },
        { label: 'Avg Student', score: 30, color: 'var(--pq-text-muted)' },
        { label: 'Internship', score: 55, color: 'var(--pq-warning)' },
        { label: 'Industry', score: 95, color: 'var(--pq-success)' },
      ],
    },
  ],
  percentile: 78,
};

// ============================================
// Recommendations
// ============================================

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    priority: 'high',
    title: 'Add deployment links to all projects',
    description:
      'Deploy your projects using Vercel, Netlify, or Railway. Live demos are the #1 thing recruiters look for.',
    category: 'Presentation',
  },
  {
    id: 'rec-2',
    priority: 'high',
    title: 'Improve README documentation',
    description:
      'Add screenshots, setup instructions, architecture diagrams, and clear project descriptions to all repositories.',
    category: 'Documentation',
  },
  {
    id: 'rec-3',
    priority: 'high',
    title: 'Add unit tests',
    description:
      'Write tests for your key functions and API routes. Even basic test coverage shows engineering maturity.',
    category: 'Engineering',
  },
  {
    id: 'rec-4',
    priority: 'medium',
    title: 'Set up CI/CD pipelines',
    description:
      'Add GitHub Actions workflows for automated testing and deployment. This signals production-readiness.',
    category: 'DevOps',
  },
  {
    id: 'rec-5',
    priority: 'medium',
    title: 'Fix exposed API keys',
    description:
      'Move all API keys to environment variables and add .env.example files to your repositories.',
    category: 'Security',
  },
  {
    id: 'rec-6',
    priority: 'medium',
    title: 'Add Docker support',
    description:
      'Create Dockerfiles for your projects. This demonstrates DevOps knowledge and makes projects easier to run.',
    category: 'DevOps',
  },
  {
    id: 'rec-7',
    priority: 'low',
    title: 'Create contribution guidelines',
    description:
      'Add CONTRIBUTING.md and issue templates to show open-source readiness.',
    category: 'Community',
  },
  {
    id: 'rec-8',
    priority: 'low',
    title: 'Add a portfolio website',
    description:
      'Create a personal portfolio site that showcases your best projects with descriptions and links.',
    category: 'Presentation',
  },
];

// ============================================
// Roast Quotes
// ============================================

export const mockRoasts: RoastQuote[] = [
  {
    id: 'roast-1',
    text: "You trained a neural network. You forgot to explain what problem it solves. The model isn't the project — the story is.",
    category: 'Documentation',
  },
  {
    id: 'roast-2',
    text: "Your code is impressive. Your README is fighting against it. It's like wearing a suit with flip-flops.",
    category: 'Presentation',
  },
  {
    id: 'roast-3',
    text: "You have 4 projects, 0 deployment links. Recruiters can't run `npm install` in a job interview.",
    category: 'Deployment',
  },
  {
    id: 'roast-4',
    text: "Your commit messages say 'fixed stuff' 47 times. What stuff? Were you fixing the same stuff each time?",
    category: 'Git Practices',
  },
  {
    id: 'roast-5',
    text: "You exposed your API key in 3 repositories. At this point, it's a feature, not a bug.",
    category: 'Security',
  },
  {
    id: 'roast-6',
    text: "Your project structure is so flat, it makes a pancake jealous. Ever heard of folders?",
    category: 'Architecture',
  },
  {
    id: 'roast-7',
    text: "Zero tests written. You're not just living on the edge — you've built your house there.",
    category: 'Testing',
  },
  {
    id: 'roast-8',
    text: "Your code quality is 87/100 but your documentation is 55/100. The code is screaming into a void.",
    category: 'Documentation',
  },
];

// ============================================
// Security Issues
// ============================================

export const mockSecurityIssues: SecurityIssue[] = [
  {
    severity: 'critical',
    title: 'API Key Exposed in Client Code',
    description: 'CoinGecko API key found in frontend JavaScript bundle',
    file: 'crypto-dashboard/src/api/config.js',
  },
  {
    severity: 'high',
    title: 'Hardcoded Database URI',
    description: 'MongoDB connection string with credentials found in source',
    file: 'taskflow-app/server/config.js',
  },
  {
    severity: 'medium',
    title: 'Missing CORS Configuration',
    description: 'API accepts requests from any origin',
    file: 'taskflow-app/server/index.js',
  },
  {
    severity: 'low',
    title: 'Outdated Dependencies',
    description: '12 packages have known vulnerabilities with available patches',
  },
];

// ============================================
// Documentation Checks
// ============================================

export const mockDocumentationChecks: DocumentationCheck[] = [
  { item: 'Project Description', present: true, quality: 'good' },
  { item: 'Setup Instructions', present: false, quality: 'missing' },
  { item: 'Installation Guide', present: true, quality: 'needs-improvement' },
  { item: 'Usage Examples', present: true, quality: 'good' },
  { item: 'Screenshots', present: false, quality: 'missing' },
  { item: 'Architecture Explanation', present: false, quality: 'missing' },
  { item: 'API Documentation', present: false, quality: 'missing' },
  { item: 'Contributing Guidelines', present: false, quality: 'missing' },
  { item: 'License', present: true, quality: 'good' },
  { item: 'Environment Variables', present: true, quality: 'needs-improvement' },
];

// ============================================
// Analysis Steps
// ============================================

export const mockAnalysisSteps: AnalysisStep[] = [
  { id: 'step-1', label: 'Scanning repositories', status: 'complete' },
  { id: 'step-2', label: 'Analyzing code quality', status: 'complete' },
  { id: 'step-3', label: 'Reviewing documentation', status: 'complete' },
  { id: 'step-4', label: 'Running security audit', status: 'complete' },
  { id: 'step-5', label: 'Detecting skills', status: 'complete' },
  { id: 'step-6', label: 'Evaluating production readiness', status: 'complete' },
  { id: 'step-7', label: 'Simulating recruiter view', status: 'complete' },
  { id: 'step-8', label: 'Generating portfolio score', status: 'complete' },
];

// ============================================
// Analysis History
// ============================================

export const mockAnalysisHistory: AnalysisHistory[] = [
  { id: 'ah-1', repositoryName: 'alexchen-dev (Full Profile)', score: 84, date: '2025-12-15', status: 'complete' },
  { id: 'ah-2', repositoryName: 'neural-style-transfer', score: 79, date: '2025-12-10', status: 'complete' },
  { id: 'ah-3', repositoryName: 'taskflow-app', score: 82, date: '2025-12-08', status: 'complete' },
  { id: 'ah-4', repositoryName: 'ml-pipeline-toolkit', score: 91, date: '2025-12-05', status: 'complete' },
  { id: 'ah-5', repositoryName: 'crypto-dashboard', score: 65, date: '2025-11-28', status: 'complete' },
];

// ============================================
// Full Analysis Report (composite)
// ============================================

export const mockAnalysisReport: AnalysisReport = {
  id: 'report-001',
  repositoryName: 'alexchen-dev',
  repositoryUrl: 'https://github.com/alexchen-dev',
  analyzedAt: '2025-12-15T14:30:00Z',
  portfolioScore: mockPortfolioScore,
  repositories: mockRepositories,
  skills: mockSkills,
  recruiterView: mockRecruiterView,
  benchmarks: mockBenchmarks,
  recommendations: mockRecommendations,
  roasts: mockRoasts,
  securityIssues: mockSecurityIssues,
  documentationChecks: mockDocumentationChecks,
};
