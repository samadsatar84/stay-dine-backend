import express from "express";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// ✅ GET /api/reservations (admin list)
router.get("/", async (req, res) => {
  try {
    const list = await Reservation.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/reservations (public submit)
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, persons } = req.body;

    if (!name || !phone || !date || !time || !persons) {
      return res.status(400).json({ message: "name, phone, date, time, persons required" });
    }

    const r = await Reservation.create({
      name,
      phone,
      date,
      time,
      persons: Number(persons),
      status: "pending",
    });

    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT /api/reservations/:id/status (admin confirm/cancel)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Reservation not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
