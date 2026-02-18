import express from "express";
import Stripe from "stripe";
import Room from "../models/Room.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout-room", async (req, res) => {
  try {
    const { roomId, nights } = req.body;

    if (!roomId || !nights) {
      return res.status(400).json({ message: "roomId and nights are required" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const qty = Number(nights);
    if (qty <= 0) return res.status(400).json({ message: "Invalid nights" });

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173"; // ✅ fallback

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: { name: `${room.title} (Per night)` },
            unit_amount: Math.round(Number(room.price) * 100),
          },
          quantity: qty,
        },
      ],
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
