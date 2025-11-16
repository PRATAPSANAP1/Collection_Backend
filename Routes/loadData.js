const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel");

const sec = process.env.secret_key;

// Middleware: validate token
function validateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, sec, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// 📌 Get profile (name, mobile, email)
router.get("/profile", validateUser, async (req, res) => {
  
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address:user.address,
      image:user.Image
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get address
router.get("/address", validateUser, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      fullName: user.name,
      line1: user.address,
      pincode: "NA", // if not in schema
      city: "NA",    // if not in schema
      state: "NA",   // if not in schema
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
