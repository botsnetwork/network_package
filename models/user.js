const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  lastInteraction: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  referredBy: { type: Number, ref: "User" },
  referralCode: { type: String, unique: true, sparse: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
