import { Notification } from "../models/Notification.js";
import TryCatch from "../middlewares/TryCatch.js";

// ✅ Get User Notifications
export const getNotifications = TryCatch(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.json({
    notifications,
    unreadCount,
  });
});

// ✅ Mark Notification as Read
export const markAsRead = TryCatch(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ message: "Notification marked as read" });
});

// ✅ Mark All as Read (FIXED)
export const markAllAsRead = TryCatch(async (req, res) => {
  try {
    console.log("📌 Mark all as read - User:", req.user._id);
    
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });
    
    console.log("📌 Unread count:", unreadCount);
    
    if (unreadCount === 0) {
      return res.json({
        success: true,
        message: "No unread notifications",
        modifiedCount: 0,
      });
    }
    
    const result = await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    
    console.log("✅ Updated:", result.modifiedCount);
    
    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("❌ Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ✅ CREATE NOTIFICATION - Route Handler
export const createNotification = TryCatch(async (req, res) => {
  const { title, message, type, link } = req.body;

  const notification = new Notification({
    user: req.user._id,
    title,
    message,
    type: type || "info",
    link: link || "",
  });

  await notification.save();

  res.status(201).json({
    success: true,
    message: "Notification created",
    notification,
  });
});

// ✅ Clear all notifications for current user
export const clearAllMyNotifications = TryCatch(async (req, res) => {
  try {
    console.log("📌 Clear all notifications - User:", req.user._id);
    
    const result = await Notification.deleteMany({ user: req.user._id });
    
    console.log("✅ Deleted:", result.deletedCount);
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Clear all error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});