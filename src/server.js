const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "/public")));

// API routes
app.use("/api/packages", require("./routes/packages"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/auth", require("./routes/auth"));

// Fallback to index.html (important for frontend routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Port (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
