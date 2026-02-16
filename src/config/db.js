import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Using MONGO_URI:", uri ? "YES" : "NO");
    await mongoose.connect(uri);
    console.log("MongoDB Connected (ATLAS)");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

