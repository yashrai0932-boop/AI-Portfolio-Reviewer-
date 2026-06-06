/**
 * ProtfoliQ API Client
 * Handles all communication with the Django backend.
 * Uses cookies for JWT authentication (httpOnly, set by Django).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: 'include', // Send cookies
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, config);

  if (res.status === 401) {
    // Try to refresh the token
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry the request
      const retryRes = await fetch(`${API_BASE}${path}`, config);
      if (!retryRes.ok) {
        throw new ApiError(retryRes.status, await retryRes.text());
      }
      return retryRes.json();
    }
    throw new ApiError(401, 'Unauthorized');
  }

  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch {
      errorText = res.statusText;
    }
    throw new ApiError(res.status, errorText);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// ============================================
// Auth
// ============================================

export async function login(email: string, password: string) {
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(
  email: string,
  password1: string,
  password2: string,
  firstName?: string,
  lastName?: string,
) {
  return apiFetch('/auth/registration/', {
    method: 'POST',
    body: {
      email,
      password1,
      password2,
      first_name: firstName || '',
      last_name: lastName || '',
    },
  });
}

export async function logout() {
  return apiFetch('/auth/logout/', { method: 'POST' });
}

export async function getCurrentUser() {
  return apiFetch('/auth/user/');
}

export async function refreshToken(): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getGitHubOAuthUrl(): Promise<{ url: string }> {
  return apiFetch('/auth/github/url/');
}

export async function loginWithGitHub(code: string) {
  return apiFetch('/auth/github/', {
    method: 'POST',
    body: { code },
  });
}

// ============================================
// Analysis
// ============================================

export async function analyzePortfolio(githubUrl: string) {
  return apiFetch('/analysis/analyze/', {
    method: 'POST',
    body: { github_url: githubUrl },
  });
}

export async function getReportStatus(reportId: number) {
  return apiFetch(`/analysis/status/${reportId}/`);
}

export async function getReports() {
  return apiFetch('/analysis/reports/');
}

export async function getReport(reportId: number | string) {
  return apiFetch(`/analysis/reports/${reportId}/`);
}

// ============================================
// Dashboard
// ============================================

export async function getDashboard() {
  return apiFetch('/dashboard/');
}

// ============================================
// Insights
// ============================================

export async function getInsights() {
  return apiFetch('/insights/');
}

// ============================================
// Profile
// ============================================

export async function getProfile() {
  return apiFetch('/profile/');
}

export async function updateProfile(data: Record<string, string>) {
  return apiFetch('/profile/', {
    method: 'PATCH',
    body: data,
  });
}
