import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Notification } from '../types';
import { currentUser, mockNotifications } from '../data/mockData';

interface UserContextType {
  user: User | null;
  notifications: Notification[];
  unreadNotifications: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate user authentication (in a real app, this would check wallet connection)
    const checkAuth = async () => {
      // For demo purposes, we'll just set the mock user after a small delay
      setTimeout(() => {
        setUser(currentUser);
        setNotifications(mockNotifications.filter(n => n.userId === currentUser.id));
      }, 1000);
    };
    
    checkAuth();
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const login = async (walletAddress: string) => {
    // In a real app, this would connect to the blockchain and verify the wallet
    // For now, we'll just set the mock user
    setUser(currentUser);
    setNotifications(mockNotifications.filter(n => n.userId === currentUser.id));
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        notifications,
        unreadNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        login,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};