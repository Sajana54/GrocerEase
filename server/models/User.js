import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    cartItems: { type: Object, default: {} },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
