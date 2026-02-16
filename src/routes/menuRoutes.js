import express from "express";
import MenuItem from "../models/MenuItem.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// PUBLIC (active only)
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN list all
router.get("/admin", auth, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN create
router.post("/", auth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, isActive } = req.body;
    if (!name || price === undefined) return res.status(400).json({ message: "name & price required" });

    const item = await MenuItem.create({
      name,
      category: category || "General",
      price: Number(price),
      description: description || "",
      imageUrl: imageUrl || "",
      isActive: isActive === undefined ? true : Boolean(isActive),
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN update
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, isActive } = req.body;

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Menu item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
