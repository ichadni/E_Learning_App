import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role || "user";
    } catch (error) {
      return "user";
    }
  };

  // ✅ SIMPLIFIED FILTERING - Show all notifications to users
  const filterNotificationsByRole = (allNotifications, role) => {
    if (!allNotifications || allNotifications.length === 0) return [];

    // ✅ STUDENT: Show ALL their notifications
    if (role === "user") {
      return allNotifications;
    }

    // ✅ ADMIN: Show admin-specific notifications
    if (role === "admin") {
      const adminTitles = [
        "💰 New Payment Pending!",
        "📚 New Enrollment!",
        "🎓 Course Completed",
        "📚 Course Added",
        "📹 Lecture Added"
      ];
      return allNotifications.filter(notif => 
        adminTitles.some(title => notif.title === title || notif.title.includes(title))
      );
    }

    // ✅ SUPERADMIN: See ALL
    if (role === "superadmin") {
      return allNotifications;
    }

    return allNotifications;
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      const { data } = await axios.get(`${server}/api/notifications`, {
        headers: { token },
      });

      const role = getUserRole();
      console.log(`👤 Current user role: ${role}`);
      console.log("📋 All notifications:", data.notifications);

      const filtered = filterNotificationsByRole(data.notifications || [], role);
      console.log(`📋 Filtered notifications for ${role}:`, filtered);

      setNotifications(filtered);
      setUnreadCount(data.unreadCount || 0);
      setLoading(false);
    } catch (error) {
      console.log("❌ Fetch notifications error:", error);
      setLoading(false);
    }
  };

  const createNotification = async (title, message, type = "info", link = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${server}/api/notifications/create`,
        { title, message, type, link },
        {
          headers: { token },
        }
      );
      await fetchNotifications();
    } catch (error) {
      console.log("❌ Create notification error:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await axios.put(
        `${server}/api/notifications/${id}`,
        {},
        {
          headers: { token },
        }
      );
      
      setTimeout(() => {
        fetchNotifications();
      }, 500);
      
    } catch (error) {
      console.log("❌ Mark as read error:", error);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      
      setNotifications([]);
      setUnreadCount(0);
      
      await axios.put(
        `${server}/api/notifications/read-all`,
        {},
        {
          headers: { token },
        }
      );
      
      setTimeout(() => {
        fetchNotifications();
      }, 500);
      
    } catch (error) {
      console.log("❌ Mark all as read error:", error);
      fetchNotifications();
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      
      setNotifications([]);
      setUnreadCount(0);
      
      await axios.delete(
        `${server}/api/notifications/all`,
        {
          headers: { token },
        }
      );
      
      setTimeout(() => {
        fetchNotifications();
      }, 500);
      
    } catch (error) {
      console.log("❌ Clear all notifications error:", error);
      fetchNotifications();
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
        createNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);