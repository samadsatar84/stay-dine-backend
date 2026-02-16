import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },   // snapshot
    price: { type: Number, required: true },  // snapshot
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },

    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ["pending", "confirmed", "cancelled", "delivered"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
