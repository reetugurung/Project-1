const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw {
        code: 409,
        message: "Email already exists",
        status: "EMAIL_ALREADY_EXISTS"
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ name, email, password: hashedPassword ,role: role|| "user"});
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(err.code || 500).json({
      message: err.message || "Something went wrong",
      status: err.status || "INTERNAL_SERVER_ERROR"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        code: 422,
        message: "User not found",
        status: "USER_NOT_FOUND"
      };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw {
        code: 401,
        message: "Invalid credentials",
        status: "INVALID_PASSWORD"
      };
    }

    // Generate token
    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(err.code || 500).json({
      message: err.message || "Something went wrong",
      status: err.status || "INTERNAL_SERVER_ERROR"
    });
  }
});

module.exports = router;
 