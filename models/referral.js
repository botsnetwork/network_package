const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: Number,
    required: true,
    ref: "User",
  },
  referrals: [
    {
      type: Number,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Referral", referralSchema);
