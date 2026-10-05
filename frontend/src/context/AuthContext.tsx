'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services';
import type { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: Parameters<typeof authService.login>[0]) => Promise<void>;
  register: (data: Parameters<typeof authService.register>[0]) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      const storedUser = localStorage.getItem('taskflow_user');
      
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse user', e);
          }
        }
        
        try {
          // Validate token
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem('taskflow_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Auth validation failed', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: Parameters<typeof authService.login>[0]) => {
    const res = await authService.login(data);
    handleAuthSuccess(res);
  };

  const register = async (data: Parameters<typeof authService.register>[0]) => {
    const res = await authService.register(data);
    handleAuthSuccess(res);
  };

  const handleAuthSuccess = (res: AuthResponse) => {
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('taskflow_token', res.token);
    localStorage.setItem('taskflow_user', JSON.stringify(res.user));
    router.push('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    router.push('/login');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
