import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminSeedRoutes from "./routes/adminSeedRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();

// ✅ CORS (Vercel + Local)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL, // https://stay-dine-frontend.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      // allow mobile apps / postman (no origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin), false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => res.send("API Running ✅"));

// ✅ routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminSeedRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ error handler
app.use((err, req, res, next) => {
  console.error("ERR:", err?.message || err);
  res.status(500).json({ message: err?.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
