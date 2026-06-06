'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from './api';

interface UserProfile {
  github_username: string;
  avatar_url: string;
  bio: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData as User);
    } catch {
      setUser(null);
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    (async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData as User);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    await apiLogin(email, password);
    await refreshUser();
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName?: string,
    lastName?: string,
  ) => {
    await apiRegister(email, password, confirmPassword, firstName, lastName);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore errors
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
