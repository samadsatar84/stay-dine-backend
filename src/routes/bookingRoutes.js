import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * PUBLIC: create booking
 * POST /api/bookings
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, roomId, checkIn, checkOut, guests } = req.body;

    if (!name || !phone || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.create({
      name,
      phone,
      room: roomId, // ✅ map
      checkIn,
      checkOut,
      guests: Number(guests),
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN: list bookings
 * GET /api/bookings
 */
router.get("/", auth, async (req, res) => {
  try {
    const list = await Booking.find()
      .populate("room", "title price image")
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
