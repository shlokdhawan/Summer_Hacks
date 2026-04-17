import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Try to load user from localStorage, otherwise use defaults
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('curator_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Alex Rivera',
      title: 'Product Architect',
      email: 'alex.rivera@curator.ai',
      bio: 'Building the future of unified communication with AI. Focus on productivity and cognitive load reduction.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&auto=format&fit=crop',
      plan: 'Pro Plan'
    };
  });

  // Persist to localStorage whenever user object changes
  useEffect(() => {
    localStorage.setItem('curator_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
