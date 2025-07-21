import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;

      const response = await axios.post('https://ai-resume-evaluator-j4px.onrender.com/api/auth/refresh-token', {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      const decodedUser = JSON.parse(atob(newToken.split('.')[1]));
      setUser(decodedUser);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // Function to get valid token (refresh if needed)
  const getValidToken = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return null;

    if (isTokenExpired(currentToken)) {
      const refreshed = await refreshToken();
      return refreshed ? localStorage.getItem('token') : null;
    }

    return currentToken;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setLoading(true);
        try {
          // Check if token is expired and refresh if needed
          const validToken = await getValidToken();
          if (validToken) {
            const res = await axios.get('https://ai-resume-evaluator-j4px.onrender.com/api/auth/me', {
              headers: { Authorization: `Bearer ${validToken}` },
            });
            setUser(res.data);
          } else {
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          setUser(null);
          setToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token' && event.newValue === null) {
        setToken(null);
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('https://ai-resume-evaluator-j4px.onrender.com/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    const decodedUser = JSON.parse(atob(data.token.split('.')[1]));
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear(); // Clear all sessionStorage data
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading, 
      refreshToken, 
      getValidToken,
      isTokenExpired 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
