import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextInstance';
import { api } from '../services/api';

const TOKEN_KEY = 'silver_auth_token';
const USER_KEY = 'silver_auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Logout action
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Verify stored session on mount
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      // If it's a demo/offline session, keep active
      if (token === 'demo_token_silver_catering') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.auth.getMe(token);
        if (isMounted && response?.user) {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
      } catch (err) {
        // If 401 Unauthorized, token has expired
        if (err.status === 401) {
          if (isMounted) {
            logout();
          }
        } else {
          // Network error or backend asleep on Render: keep cached user session so app doesn't break
          console.warn('Backend verification delayed or offline. Using cached user session:', err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  // Login action
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const response = await api.auth.login(email, password);
      if (response && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.message || 'Failed to sign in. Please check your credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Register action
  const register = useCallback(async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await api.auth.register(name, email, password);
      if (response && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.message || 'Failed to create account. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Offline / Demo mode (fallback for instant access)
  const loginAsDemo = useCallback(() => {
    const demoUser = {
      id: 'demo-user-1',
      name: 'Admin Manager',
      email: 'admin@silvercatering.in',
      role: 'admin',
      isDemo: true
    };
    const demoToken = 'demo_token_silver_catering';
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    setAuthError(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    loginAsDemo,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
