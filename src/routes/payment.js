const express = require("express");
const router = express.Router();
const { stkPush, stkQuery } = require("../config/mpesa");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Package = require("../models/Package");

// Initiate M-Pesa Payment
router.post("/initiate", async (req, res) => {
  try {
    const { phone, packageId } = req.body;

    if (!phone || !packageId) {
      return res.status(400).json({ error: "Phone and package are required" });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // Create pending transaction
    const transaction = await Transaction.create({
      phone,
      amount: pkg.price,
      packageId: pkg._id,
      packageName: pkg.name,
      status: "pending",
    });

    // Initiate STK Push
    const stkResponse = await stkPush({
      phone,
      amount: pkg.price,
      accountRef: `HOTSPOT-${transaction._id}`,
      description: `${pkg.name} - Hotspot Access`,
    });

    // Save checkout request ID
    transaction.checkoutRequestId = stkResponse.CheckoutRequestID;
    transaction.merchantRequestId = stkResponse.MerchantRequestID;
    await transaction.save();

    res.json({
      success: true,
      message: "STK Push sent to your phone. Enter M-Pesa PIN to complete.",
      transactionId: transaction._id,
      checkoutRequestId: stkResponse.CheckoutRequestID,
    });
  } catch (error) {
    console.error("Payment initiation error:", error.message);
    res.status(500).json({ error: "Payment initiation failed. Try again." });
  }
});

// M-Pesa Callback URL (Safaricom calls this after payment)
router.post("/mpesa/callback", async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = stkCallback;

    const transaction = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!transaction) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (ResultCode === 0) {
      // Payment successful
      const items = CallbackMetadata.Item;
      const receiptNumber = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
      const amount = items.find((i) => i.Name === "Amount")?.Value;

      transaction.status = "completed";
      transaction.mpesaReceiptNumber = receiptNumber;
      transaction.sessionStart = new Date();

      // Get package duration
      const pkg = await Package.findById(transaction.packageId);
      if (pkg) {
        transaction.sessionEnd = new Date(Date.now() + pkg.duration * 60 * 1000);
      }
      await transaction.save();

      // Activate user session
      await User.findOneAndUpdate(
        { phone: transaction.phone },
        {
          isActive: true,
          sessionExpiry: transaction.sessionEnd,
          $inc: { totalSpent: amount },
        },
        { upsert: true }
      );
    } else {
      transaction.status = "failed";
      await transaction.save();
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("Callback error:", error);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
});

// Check Payment Status
router.get("/status/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    res.json({
      status: transaction.status,
      receipt: transaction.mpesaReceiptNumber,
      sessionEnd: transaction.sessionEnd,
      amount: transaction.amount,
      package: transaction.packageName,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching status" });
  }
});

// Query STK Push status manually
router.post("/query", async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    const result = await stkQuery(checkoutRequestId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Query failed" });
  }
});

module.exports = router;
