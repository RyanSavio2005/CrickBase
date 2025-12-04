import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('adminToken');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    setIsAdmin(true);
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
  };

  const getAuthHeaders = () => {
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
    return {};
  };

  return (
    <AdminContext.Provider value={{ isAdmin, token, login, logout, getAuthHeaders }}>
      {children}
    </AdminContext.Provider>
  );
};

