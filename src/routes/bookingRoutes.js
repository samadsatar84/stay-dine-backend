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
    const { name, phone, room, roomId, checkIn, checkOut, guests } = req.body;

    // ✅ accept both: room OR roomId
    const finalRoomId = room || roomId;

    if (!name || !phone || !finalRoomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields required" });
    }

    const g = Number(guests) || 1;
    if (g < 1) return res.status(400).json({ message: "Invalid guests" });

    const booking = await Booking.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      room: finalRoomId,
      checkIn,
      checkOut,
      guests: g,
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
