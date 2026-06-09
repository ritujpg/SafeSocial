import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; username: string; email: string; fullName: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser({
          id: 'ADM-001',
          username,
          email: username,
          fullName: 'SafeSocial User',
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser({
          id: 'USR-NEW',
          username,
          email,
          fullName,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
      }}
    >
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