import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminSeedRoutes from "./routes/adminSeedRoutes.js";

const app = express();

// ✅ CORS (localhost + vercel)
const allowed = ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean);
app.use(
  cors({
    origin: allowed,
    credentials: true,
  })
);

app.use(express.json());

// ✅ routes
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminSeedRoutes);

// ✅ start
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log("Server running on port", PORT));
  })
  .catch((e) => {
    console.log("DB connect failed:", e.message);
    process.exit(1);
  });
