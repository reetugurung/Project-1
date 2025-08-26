const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const authMiddleware = require("../middlewares/authMiddleware");

// Get profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
        status: "PROFILE_NOT_FOUND"
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", status: "SERVER_ERROR" });
  }
});

// Create or Update profile
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bio, skills, github, linkedin, projects } = req.body;

    const profileData = {
      user: req.user.id,
      bio,
      skills,
      github,
      linkedin,
      projects
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", status: "SERVER_ERROR" });
  }
});

module.exports = router;
