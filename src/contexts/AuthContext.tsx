
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataService } from '@/lib/data-service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const login = (username: string, password: string): boolean => {
    const authenticated = DataService.authenticateAdmin(username, password);
    if (authenticated) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
    }
    return authenticated;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
