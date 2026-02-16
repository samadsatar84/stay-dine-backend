// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const adminSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, trim: true, lowercase: true },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // ✅ password hash (NO next parameter)
// adminSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

// export default mongoose.model("Admin", adminSchema);
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
