import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: "" },

  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
