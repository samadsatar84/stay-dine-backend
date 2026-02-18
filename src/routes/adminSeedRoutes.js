import express from "express";
import Room from "../models/Room.js";
import MenuItem from "../models/MenuItem.js";
import Admin from "../models/Admin.js";

const router = express.Router();

/**
 * POST /api/admin/seed-dummy
 * Body: { key: "12345" }
 *
 * Ye dummy rooms + menu items create/update kar dega.
 * Same titles dubara seed karo to duplicates nahi banayega (upsert).
 */
router.post("/seed-dummy", async (req, res) => {
  try {
    const key = String(req.body?.key || "");
    const seedKey = String(process.env.SEED_KEY || "");

    if (!seedKey || key !== seedKey) {
      return res.status(401).json({ message: "Invalid seed key" });
    }

    // Optional: ensure admin exists (if tumhara admin already hai, ignore)
    // (Agar tumhara Admin model different fields use karta hai, is part ko comment kar do)
    const adminEmail = "admin@stay.com";
    const adminPass = "admin123";
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({ email: adminEmail, password: adminPass });
    }

    // ====== DUMMY ROOMS (professional images) ======
    const rooms = [
      {
        title: "Executive Gold Suite",
        price: 32000,
        capacity: 2,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Luxury Deluxe King",
        price: 45000,
        capacity: 3,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Presidential Penthouse",
        price: 95000,
        capacity: 5,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Family Royal Room",
        price: 56000,
        capacity: 6,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Budget Comfort Room",
        price: 18000,
        capacity: 2,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
      },
      {
        title: "Garden View Twin",
        price: 26000,
        capacity: 2,
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
      },
    ];

    // upsert by title
    const roomOps = rooms.map((r) => ({
      updateOne: {
        filter: { title: r.title },
        update: { $set: r },
        upsert: true,
      },
    }));
    await Room.bulkWrite(roomOps);

    // ====== DUMMY MENU (restaurant) ======
    const menu = [
      // Starters
      {
        title: "Truffle Fries",
        price: 1650,
        category: "Starters",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=80",
        desc: "Crispy fries with truffle oil, parmesan & house dip.",
      },
      {
        title: "Chicken Dynamite Bites",
        price: 1850,
        category: "Starters",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80",
        desc: "Spicy creamy dynamite sauce, premium chicken bites.",
      },

      // Main Course
      {
        title: "Grilled Chicken Steak",
        price: 2950,
        category: "Main Course",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1604908176997-9d5a1a6fbb77?auto=format&fit=crop&w=1400&q=80",
        desc: "Juicy grilled steak, pepper sauce, sautéed veggies.",
      },
      {
        title: "Beef Biryani (Premium)",
        price: 1350,
        category: "Main Course",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1630409346695-840d7d24604f?auto=format&fit=crop&w=1400&q=80",
        desc: "Aromatic basmati, tender beef, raita & salad.",
      },

      // BBQ
      {
        title: "BBQ Platter (2 Persons)",
        price: 4200,
        category: "BBQ",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
        desc: "Seekh kebab, chicken tikka, malai boti, naan & sauce.",
      },

      // Desserts
      {
        title: "Molten Lava Cake",
        price: 1250,
        category: "Desserts",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1400&q=80",
        desc: "Warm chocolate lava, vanilla ice cream.",
      },

      // Beverages
      {
        title: "Signature Mint Mojito",
        price: 850,
        category: "Beverages",
        isActive: true,
        image:
          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=80",
        desc: "Fresh mint, lime, premium syrup, chilled.",
      },
    ];

    // upsert by title
    const menuOps = menu.map((m) => ({
      updateOne: {
        filter: { title: m.title },
        update: { $set: m },
        upsert: true,
      },
    }));
    await MenuItem.bulkWrite(menuOps);

    const roomsCount = await Room.countDocuments();
    const menuCount = await MenuItem.countDocuments();

    res.json({
      message: "Dummy data seeded successfully",
      roomsCount,
      menuCount,
      admin: { email: adminEmail, password: adminPass },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Seed failed" });
  }
});

export default router;
