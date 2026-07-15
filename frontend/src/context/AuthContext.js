import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const readStoredUser = () => {
  const raw = localStorage.getItem('deskflow_user');
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('deskflow_token'));

  const signIn = useCallback((userData, jwtToken) => {
    localStorage.setItem('deskflow_user', JSON.stringify(userData));
    localStorage.setItem('deskflow_token', jwtToken);
    setUser(userData);
    setToken(jwtToken);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('deskflow_user');
    localStorage.removeItem('deskflow_token');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
