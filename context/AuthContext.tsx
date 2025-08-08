import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useContext, useState } from 'react';



type AuthContextType = {
  isAuthenticated: boolean;
  checkPassword: (user: string, pin: string) => Promise<boolean>;
  login?: (pin: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const db = useSQLiteContext();


  const checkPassword = async (user: string, pin: string) => {
    const result = await db.getAllAsync('SELECT * FROM staff WHERE name = ? AND pin = ?', [user, pin]);
    const success = !!result[0];
    if (success) {
      setIsAuthenticated(true);
    }
    // Log the login attempt
    try {
      await db.runAsync(
        'INSERT INTO login_logs (staff_name, login_time, success) VALUES (?, ?, ?)',
        [user, Date.now(), success ? 1 : 0]
      );
    } catch (e) {
      console.warn('Login log failed:', (e as any).message);
    }
    return success;
  };


  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
