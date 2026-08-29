const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/admin");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  }
});

app.get("/csrf-token", (req, res) => {
  res.json({
    message: "CSRF route is working"
  });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.send("Test complete");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});