const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    packageName: { type: String },
    mpesaReceiptNumber: { type: String },
    checkoutRequestId: { type: String },
    merchantRequestId: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    sessionStart: { type: Date },
    sessionEnd: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
