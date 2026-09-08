import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    method: {
      type: String,
      enum: ["bkash_manual", "bkash_auto", "razorpay"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    bkash: {
      senderNumber: String,
      paymentID: String,
      trxID: String,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);