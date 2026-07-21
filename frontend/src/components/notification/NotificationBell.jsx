import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./notification.css";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,  // ✅ ADD THIS
    fetchNotifications 
  } = useNotification();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setIsOpen(false);
  };

  // ✅ Clear all notifications using context
  const handleClearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    
    try {
      await clearAllNotifications();
      toast.success("All notifications cleared");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to clear notifications");
      console.log("❌ Clear all error:", error);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return "#27ae60";
      case "warning": return "#f39c12";
      case "error": return "#e74c3c";
      default: return "#6a1b9a";
    }
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>
              Notifications
              {unreadCount > 0 && <span className="unread-badge">{unreadCount} unread</span>}
            </h4>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button onClick={handleClearAll} className="clear-all-btn" title="Clear all notifications">
                  <FaTrash /> Clear All
                </button>
              )}
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="mark-all-read">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <span className="empty-icon">🔔</span>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ borderLeft: `4px solid ${getTypeColor(notification.type)}` }}
                >
                  <div className="notification-content">
                    <h5>{notification.title}</h5>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;