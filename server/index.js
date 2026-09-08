import express from "express";
import "dotenv/config";
import { connectDb } from "./database/db.js";
import cors from "cors";


const app = express();

// using middlewares
app.use(express.json());
app.use(cors({
  origin: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""),
}));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is working");
});


// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import notificationRoutes from "./routes/notification.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api", notificationRoutes);
app.use("/api", paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});