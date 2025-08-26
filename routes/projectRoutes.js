const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { createProject, getAllProjects,getProjectById,updateProject,deleteProject } = require("../controllers/projectController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

// For multi-image upload: field name is 'images'
router.post("/", authMiddleware, authorizeRole("admin"), upload.array("images", 5), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", authMiddleware, authorizeRole("admin"), updateProject);
router.delete("/:id", authMiddleware, authorizeRole("admin"), deleteProject);


module.exports = router;
