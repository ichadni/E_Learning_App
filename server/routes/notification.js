import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,  // ✅ ADD THIS IMPORT
} from "../controllers/notification.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/notifications", isAuth, getNotifications);
router.put("/notifications/:id", isAuth, markAsRead);
router.put("/notifications/read-all", isAuth, markAllAsRead);
router.post("/notifications/create", isAuth, createNotification);  // ✅ ADD THIS ROUTE

export default router;