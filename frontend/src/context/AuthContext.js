import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskflow_user');
    if (stored) setUser(JSON.parse(stored));
    const dm = localStorage.getItem('taskflow_dark') === 'true';
    setDarkMode(dm);
    if (dm) document.documentElement.classList.add('dark');
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('taskflow_dark', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, darkMode, toggleDark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
