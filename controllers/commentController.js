const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const { projectId } = req.params;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newComment = new Comment({
      projectId,
      name,
      email,
      message,
    });

    await newComment.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({ projectId, isApproved: true }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};

const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
