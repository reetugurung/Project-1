const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      default: "Anonymous",
    },
    email: {
      type: String,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true // Optionally you can moderate
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
