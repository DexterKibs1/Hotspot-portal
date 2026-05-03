const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    macAddress: { type: String },
    isActive: { type: Boolean, default: false },
    sessionExpiry: { type: Date },
    totalSpent: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
