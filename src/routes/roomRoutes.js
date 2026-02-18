import express from "express";
import Room from "../models/Room.js";
import auth from "../middleware/auth.js";

import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * PUBLIC: Get rooms
 * GET /api/rooms
 * Optional query: ?active=true  -> only active rooms
 */
router.get("/", async (req, res) => {
  try {
    const onlyActive = String(req.query.active || "") === "true";
    const filter = onlyActive ? { isActive: true } : {};
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN: Create room
 * POST /api/rooms
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, price, capacity, isActive } = req.body;

    if (!title || price === undefined || capacity === undefined) {
      return res.status(400).json({ message: "title, price, capacity are required" });
    }

    const room = await Room.create({
      title,
      price: Number(price),
      capacity: Number(capacity),
      isActive: isActive === undefined ? true : Boolean(isActive),
      image: req.body.image || "",
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN: Update room
 * PUT /api/rooms/:id
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, price, capacity, isActive, image } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (title !== undefined) room.title = title;
    if (price !== undefined) room.price = Number(price);
    if (capacity !== undefined) room.capacity = Number(capacity);
    if (isActive !== undefined) room.isActive = Boolean(isActive);
    if (image !== undefined) room.image = image;

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN: Delete room
 * DELETE /api/rooms/:id
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    await Room.deleteOne({ _id: req.params.id });
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN: Upload room image (Cloudinary)
 * POST /api/rooms/:id/image
 * form-data: image=<file>
 */
router.post("/:id/image", auth, upload.single("image"), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const b64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: "stay-dine/rooms",
    });

    room.image = uploadRes.secure_url;
    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
