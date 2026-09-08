import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  clearAllMyNotifications,
} from "../controllers/notification.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ============ NOTIFICATION ROUTES ============

// Get all notifications for current user
router.get("/notifications", isAuth, getNotifications);

// Mark a single notification as read
router.put("/notifications/:id", isAuth, markAsRead);

// Mark all notifications as read
router.put("/notifications/read-all", isAuth, markAllAsRead);

// Create a new notification
router.post("/notifications/create", isAuth, createNotification);

// ✅ Clear all notifications for current user
router.delete("/notifications/all", isAuth, clearAllMyNotifications);

export default router;