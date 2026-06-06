/**
 * ProtfoliQ API Client
 * Handles all communication with the Django backend.
 * Uses localStorage for JWT tokens (required for cross-origin deployment).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ============================================
// Token Management
// ============================================

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshTokenValue(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ============================================
// Core Fetch Wrapper
// ============================================

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const token = getAccessToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
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
      // Update the Authorization header with the new token
      const newToken = getAccessToken();
      const retryConfig: RequestInit = {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
          ...headers,
        },
      };
      const retryRes = await fetch(`${API_BASE}${path}`, retryConfig);
      if (!retryRes.ok) {
        throw new ApiError(retryRes.status, await retryRes.text());
      }
      return retryRes.json();
    }
    clearTokens();
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

interface AuthResponse {
  access: string;
  refresh: string;
  user: unknown;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: { email, password },
  });
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
  }
  return data;
}

export async function register(
  email: string,
  password1: string,
  password2: string,
  firstName?: string,
  lastName?: string,
) {
  const data = await apiFetch<AuthResponse>('/auth/registration/', {
    method: 'POST',
    body: {
      email,
      password1,
      password2,
      first_name: firstName || '',
      last_name: lastName || '',
    },
  });
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
  }
  return data;
}

export async function logout() {
  try {
    await apiFetch('/auth/logout/', { method: 'POST' });
  } catch {
    // ignore
  }
  clearTokens();
}

export async function getCurrentUser() {
  return apiFetch('/auth/user/');
}

export async function refreshToken(): Promise<boolean> {
  const refresh = getRefreshTokenValue();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getGitHubOAuthUrl(): Promise<{ url: string }> {
  return apiFetch('/auth/github/url/');
}

export async function loginWithGitHub(code: string) {
  const data = await apiFetch<AuthResponse>('/auth/github/', {
    method: 'POST',
    body: { code },
  });
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
  }
  return data;
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
