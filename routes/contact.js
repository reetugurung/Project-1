const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { sendContactEmail } = require("../services/emailService");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "All fields are required",
      status: "VALIDATION_ERROR"
    });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    await sendContactEmail({ name, email, message });

    res.status(201).json({
      message: "Message received and email sent!",
      status: "MESSAGE_SAVED"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      status: "SERVER_ERROR"
    });
  }
});

module.exports = router;
