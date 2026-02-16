import express from "express";
import Stripe from "stripe";
import Room from "../models/Room.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout-room", async (req, res) => {
  try {
    const { roomId, nights = 1 } = req.body;
    if (!roomId) return res.status(400).json({ message: "roomId required" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const n = Math.max(1, Number(nights));
    const amountPKR = n * Number(room.price);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: { name: `Stay & Dine — ${room.title}` },
            unit_amount: Math.round(amountPKR * 100), // PKR -> paisa
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { roomId: String(room._id), nights: String(n) },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
