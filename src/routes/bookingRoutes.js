import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// PUBLIC: create booking
router.post("/", async (req, res) => {
  try {
    const { name, phone, room, checkIn, checkOut } = req.body;
    if (!name || !phone || !room || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.create({ name, phone, room, checkIn, checkOut });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: get bookings
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: change booking status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body; // pending/approved/rejected
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status || booking.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
