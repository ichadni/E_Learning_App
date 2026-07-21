import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      const { data } = await axios.get(`${server}/api/notifications`, {
        headers: { token },
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setLoading(false);
    } catch (error) {
      console.log("Fetch notifications error:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${server}/api/notifications/${id}`,
        {},
        {
          headers: { token },
        }
      );
      await fetchNotifications();
    } catch (error) {
      console.log("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${server}/api/notifications/read-all`,
        {},
        {
          headers: { token },
        }
      );
      await fetchNotifications();
    } catch (error) {
      console.log("Mark all as read error:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchNotifications();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);