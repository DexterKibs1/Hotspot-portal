const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    speed: { type: String, default: "Unlimited" },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
