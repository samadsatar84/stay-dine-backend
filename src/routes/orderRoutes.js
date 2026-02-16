import express from "express";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// PUBLIC: place order
router.post("/", async (req, res) => {
  try {
    const { customerName, phone, address, notes, items } = req.body;

    if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "customerName, phone, items required" });
    }

    // items: [{ menuItemId, qty }]
    const ids = items.map((i) => i.menuItemId);
    const menu = await MenuItem.find({ _id: { $in: ids } });

    // build snapshot items + total
    const snapshot = [];
    let total = 0;

    for (const i of items) {
      const m = menu.find((x) => String(x._id) === String(i.menuItemId));
      if (!m) return res.status(400).json({ message: "Invalid menuItemId in items" });
      const qty = Number(i.qty || 1);
      if (qty < 1) return res.status(400).json({ message: "qty must be >= 1" });

      snapshot.push({
        menuItem: m._id,
        name: m.name,
        price: Number(m.price),
        qty,
      });
      total += Number(m.price) * qty;
    }

    const order = await Order.create({
      customerName,
      phone,
      address: address || "",
      notes: notes || "",
      items: snapshot,
      total,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: list all orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: update status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
