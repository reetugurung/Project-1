const express = require("express");
const router = express.Router();
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const auth = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

// Public: Add & view comments
router.post("/:projectId", addComment);
router.get("/:projectId", getComments);

// Admin: Delete comment
router.delete("/:id", auth, authorizeRole("admin"), deleteComment);

module.exports = router;
