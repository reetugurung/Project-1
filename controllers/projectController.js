const Project = require("../models/Project");
const logAction = require("../models/utils/logger");

const createProject = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Missing request body. Are you sending form-data?",
      status: "BAD_REQUEST"
    });
  }
  console.log("BODY:", req.body);
console.log("FILES:", req.files);

  const { title, description, technologies, githubUrl, liveUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required.",
      status: "VALIDATION_ERROR"
    });
  }
  let parsedTechnologies = [];
  try {
    parsedTechnologies = JSON.parse(technologies);
  } catch (err) {
    parsedTechnologies = technologies?.split(",") || [];
  }
  const imagePaths = req.files?.map(file => file.filename) || [];

  try {
    const newProject = new Project({
      title,
      description,
      technologies: parsedTechnologies,
      githubUrl,
      liveUrl,
      images: imagePaths,
      createdBy: req.user?.id|| null // assuming you store user info in JWT
    });

    const savedProject = await newProject.save();
    await logAction(req.user?.id || "unknown", "CREATE_PROJECT", `Created project: ${savedProject.title}`);


    res.status(201).json({
      message: "Project created successfully.",
      project: savedProject
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while saving the project.",
      status: "SERVER_ERROR"
    });
  }
};



const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", tech } = req.query;

    const query = {
      title: { $regex: search, $options: "i" } // case-insensitive search on title
    };

    if (tech) {
      query.technologies = tech; // filter by single technology
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

  
  const getProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
      project.views =(project.views || 0) +1;
      await project.save();
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const updateProject = async (req, res) => {
    try {
      const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating project" });
    }
  };
  
  const deleteProject = async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  };


module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
};
