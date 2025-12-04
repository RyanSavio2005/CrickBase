import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id || user.id);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setUserId(userData._id || userData.id);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  const getAuthHeaders = () => {
    if (userId) {
      return {
        'user-id': userId
      };
    }
    return {};
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userId, 
      isAuthenticated,
      login, 
      logout, 
      getAuthHeaders 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

