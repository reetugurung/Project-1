// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes =require('./routes/auth');
const profileRoutes =require('./routes/profile');
const contactRoutes = require("./routes/contact");
const projectRoutes =require('./routes/project');
const logVisitor= require("./middlewares/visitorLogger");
require('dotenv').config();

// Initialize app
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Portfolio API Running!');
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
  
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/analytics", require("./routes/analytics"));
  app.use("/uploads", express.static("uploads"));
  app.use(logVisitor);
  app.use("api/comments", require("./routes/comment"));

  