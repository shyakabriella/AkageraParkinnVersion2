import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo credentials – swap for real API auth in production
const DEMO_CREDENTIALS = {
  email: 'admin@akageraparkinn.com',
  password: 'akagera2025',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('api_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    // Simulate async call
    await new Promise((r) => setTimeout(r, 900));
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const u = { name: 'Admin', email, role: 'admin', avatar: null };
      setUser(u);
      localStorage.setItem('api_user', JSON.stringify(u));
      setLoading(false);
      return true;
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('api_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
