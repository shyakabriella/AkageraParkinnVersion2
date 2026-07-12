import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session on mount (sessionStorage only)
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid stored user data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
      }
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.data.token;
        const userData = data.data.user;
        
        // Store ONLY in sessionStorage (cleared when tab is closed)
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear sessionStorage only
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const isAuthenticated = () => {
    return !!getToken() && !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        logout,
        getToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}