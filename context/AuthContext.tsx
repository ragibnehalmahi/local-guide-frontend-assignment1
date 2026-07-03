// context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guide' | 'tourist';
  profilePicture?: string;
  wishlist?: string[];
}

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
} | undefined>(undefined);

// Helper: পঠনযোগ্য কুকি থেকে ইউজার ডাটা বের করা
const getUserFromCookie = (): User | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'user' && value) {
      try {
        const userData = JSON.parse(decodeURIComponent(value));
        return {
          id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profilePicture: userData.profilePicture,
          wishlist: userData.wishlist || [],
        };
      } catch {
        return null;
      }
    }
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = (backendUser: any): User => ({
    id: backendUser._id || backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role,
    profilePicture: backendUser.profilePicture,
    wishlist: backendUser.wishlist || [],
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        // ১. localStorage থেকে টোকেন চেক করুন
        const token = localStorage.getItem('accessToken');
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          });
          if (res.ok) {
            const json = await res.json();
            const backendUser = json.data || json;
            setUser(mapUser(backendUser));
            setIsLoading(false);
            return;
          } else {
            localStorage.removeItem('accessToken');
          }
        }

        // ২. যদি টোকেন না থাকে, তবে `user` কুকি থেকে ইউজার লোড করুন
        const userFromCookie = getUserFromCookie();
        if (userFromCookie) {
          setUser(userFromCookie);
        }
      } catch (err) {
        console.error('Auth loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('accessToken', token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (res.ok) {
      const json = await res.json();
      const backendUser = json.data || json;
      setUser(mapUser(backendUser));
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};