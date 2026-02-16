// export default router;
import express from "express";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

const router = express.Router();

// one-time admin create
router.post("/seed-admin", async (req, res) => {
  try {
    const { email, password, key } = req.body;

    if (key !== process.env.SEED_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.json({ message: "Admin already exists" });

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hash });
    console.log("Admin saved in DB:", admin.email, admin._id);

    res.status(201).json({ message: "Admin created", admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// reset admin password
router.post("/reset-admin-pass", async (req, res) => {
  try {
    const { email, newPassword, key } = req.body;
    if (key !== process.env.SEED_KEY) return res.status(401).json({ message: "Unauthorized" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const hash = await bcrypt.hash(newPassword, 10);
    admin.password = hash;
    await admin.save();

    res.json({ message: "Password reset done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
