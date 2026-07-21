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

// ✅ Mark All as Read
export const markAllAsRead = TryCatch(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ message: "All notifications marked as read" });
});

// ✅ CREATE NOTIFICATION - Route Handler (FIXED)
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