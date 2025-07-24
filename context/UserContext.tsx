import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const UserContext = createContext({
  user: null,
  setUser: (user) => {},
  refreshUser: (userId) => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const loadUser = async (userId) => {
    const userData = await api.fetchUser(userId);
    setUser(userData);
  };

  useEffect(() => {
    // Optionally, load user from local storage or context on mount
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: loadUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 