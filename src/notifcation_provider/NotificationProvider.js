import React, { createContext, useState, useContext } from 'react';

// Create a context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setHasNewNotification(true);
  };

  const markNotificationsAsRead = () => {
    setHasNewNotification(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        hasNewNotification,
        notifications,
        addNotification,
        markNotificationsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
