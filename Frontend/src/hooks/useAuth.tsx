"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (data: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name,
            phone: session.user.user_metadata?.phone,
            date_of_birth: session.user.user_metadata?.date_of_birth,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          phone: session.user.user_metadata?.phone,
          date_of_birth: session.user.user_metadata?.date_of_birth,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (data: any) => {
    const { email, password, full_name, phone, date_of_birth } = data;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, phone, date_of_birth }),
    });

    let parsed: any = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      throw new Error(parsed?.detail || 'Signup failed');
    }

    return parsed;
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.detail || data?.message || 'Login failed');
    }

    const messageText = typeof data?.message === 'string' ? data.message.toLowerCase() : '';
    const looksSuccessful = Boolean(
      data?.access_token ||
      data?.session ||
      data?.user ||
      data?.profile ||
      data?.token ||
      data?.ok === true ||
      messageText.includes('success') ||
      messageText.includes('signed in') ||
      messageText.includes('logged in') ||
      messageText.includes('welcome')
    );

    if (data?.access_token) {
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token || '',
      });
    }

    if (looksSuccessful) {
      const userPayload = data?.user || data?.profile || null;
      setUser({
        id: userPayload?.id || data?.id || 'local-user',
        email: userPayload?.email || email,
        full_name: userPayload?.full_name || userPayload?.name || data?.full_name || data?.name,
        phone: userPayload?.phone || data?.phone,
        date_of_birth: userPayload?.date_of_birth || data?.date_of_birth,
      });
    }

    return data;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
