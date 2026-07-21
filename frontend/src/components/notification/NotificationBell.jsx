import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import "./notification.css";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
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
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
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
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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