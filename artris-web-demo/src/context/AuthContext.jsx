import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('artris_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Mock login - in real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: `user-${Date.now()}`,
          email,
          name: role === 'student' ? 'Jerry Cao' : 'Sarah Chen',
          role,
          avatar: role === 'student' 
            ? 'https://i.pravatar.cc/150?img=5' 
            : 'https://i.pravatar.cc/150?img=12',
        };
        setUser(userData);
        localStorage.setItem('artris_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const register = (email, password, name, role) => {
    // Mock register
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: `user-${Date.now()}`,
          email,
          name,
          role,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        };
        setUser(userData);
        localStorage.setItem('artris_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('artris_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
