const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bio: String,
  skills: [String],
  github: String,
  linkedin: String,
  projects: [
    {
      title: String,
      description: String,
      link: String
    }
  ]
});

module.exports = mongoose.model("Profile", profileSchema);
