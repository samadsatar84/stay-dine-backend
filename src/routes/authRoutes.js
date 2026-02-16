import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    console.log("Found admin:", admin?.email);

    if (!admin) return res.status(401).json({ message: "Invalid login" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid login" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  
});

export default router;
