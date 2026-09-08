import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { 
  submitBkashPayment,
  verifyPayment,
  getPendingPayments,
  getAllPayments
} from "../controllers/payment.js";

const router = express.Router();

// ✅ User submits payment for verification
router.post("/payment/bkash/submit", isAuth, submitBkashPayment);

// ✅ Admin routes
router.put("/payment/verify/:paymentId", isAuth, verifyPayment);
router.get("/payment/pending", isAuth, getPendingPayments);
router.get("/payment/all", isAuth, getAllPayments);

export default router;