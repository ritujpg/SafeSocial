import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; username: string; email: string; fullName: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (fullName: string, username: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = (username: string, password: string) => {
    // Mock authentication - accept 'admin' / 'admin123'
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUser({
        id: 'ADM-001',
        username: 'admin',
        email: 'admin@safesocial.com',
        fullName: 'John Admin'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = (fullName: string, username: string, email: string, password: string) => {
    // Mock registration - always succeeds for demo
    if (username && email && password) {
      setIsAuthenticated(true);
      setUser({
        id: 'USR-NEW',
        username,
        email,
        fullName
      });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
