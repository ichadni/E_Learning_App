import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";
import { Progress } from "../models/Progress.js";
import { Payment } from "../models/Payment.js";
import { Notification } from "../models/Notification.js";
import { Enrollment } from "../models/Enrollment.js"; // ✅ ADD THIS

// ✅ Submit bKash Payment for Verification
export const submitBkashPayment = async (req, res) => {
  try {
    const { courseId, senderNumber, transactionId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (user.subscription.includes(courseId)) {
      return res.status(400).json({ message: "You already have this course" });
    }

    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({ message: "Transaction ID already used" });
    }

    const payment = new Payment({
      user: userId,
      course: courseId,
      method: "bkash_manual",
      transactionId: transactionId,
      amount: course.price,
      currency: "BDT",
      status: "pending",
      bkash: {
        senderNumber: senderNumber,
      },
    });

    await payment.save();

    // ✅ To All ADMINS: New Payment Pending
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "💰 New Payment Pending!",
        message: `${user.name} submitted payment for "${course.title}"`,
        type: "warning",
        link: "/admin/payments",
      });
    }

    // ✅ To All SUPERADMINS: New Payment Pending
    const superadmins = await User.find({ role: "superadmin" });
    for (const superadmin of superadmins) {
      await Notification.create({
        user: superadmin._id,
        title: "💰 New Payment Pending!",
        message: `${user.name} submitted payment for "${course.title}"`,
        type: "warning",
        link: "/admin/payments",
      });
    }

    console.log("✅ Payment pending notifications sent to admins");

    res.status(200).json({
      success: true,
      message: "Payment submitted! Waiting for admin verification.",
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Verify Payment (Manually)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payment = await Payment.findById(paymentId)
      .populate("user")
      .populate("course");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({ message: "Payment already verified" });
    }

    const user = await User.findById(payment.user._id);
    const course = await Courses.findById(payment.course._id);

    if (!user.subscription.includes(course._id)) {
      user.subscription.push(course._id);
      await user.save();

      await Progress.create({
        course: course._id,
        completedLectures: [],
        user: user._id,
      });

      // ✅ SAVE ENROLLMENT WITH DATE
      await Enrollment.create({
        user: user._id,
        course: course._id,
        enrolledAt: new Date(),
      });
    }

    payment.status = "completed";
    payment.paymentDate = new Date();
    await payment.save();

    // ✅ SEND ALL NOTIFICATIONS

    // 1. To USER: Payment Verified
    await Notification.create({
      user: user._id,
      title: "✅ Payment Verified!",
      message: `Your payment for "${course.title}" has been verified! Start learning now.`,
      type: "success",
      link: `/course/study/${course._id}`,
    });

    // 2. To USER: Course Enrolled
    await Notification.create({
      user: user._id,
      title: "📚 Course Enrolled!",
      message: `You have successfully enrolled in "${course.title}"`,
      type: "success",
      link: `/course/study/${course._id}`,
    });

    // 3. To USER: Course Started
    await Notification.create({
      user: user._id,
      title: "🚀 Course Started!",
      message: `You started "${course.title}". Complete your first lecture!`,
      type: "info",
      link: `/lectures/${course._id}`,
    });

    // 4. To All ADMINS: New Enrollment
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "📚 New Enrollment!",
        message: `${user.name} has enrolled in "${course.title}"`,
        type: "info",
        link: "/admin/dashboard",
      });
    }

    // 5. To All SUPERADMINS: New Enrollment
    const superadmins = await User.find({ role: "superadmin" });
    for (const superadmin of superadmins) {
      await Notification.create({
        user: superadmin._id,
        title: "📚 New Enrollment!",
        message: `${user.name} has enrolled in "${course.title}"`,
        type: "info",
        link: "/admin/dashboard",
      });
    }

    console.log("✅ All notifications sent for payment verification");

    res.status(200).json({
      success: true,
      message: "Payment verified! User enrolled successfully.",
      payment: payment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Get All Pending Payments
export const getPendingPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payments = await Payment.find({ status: "pending" })
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments: payments,
    });
  } catch (error) {
    console.error("Get pending payments error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Get All Payments (History)
export const getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments: payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ message: error.message });
  }
};