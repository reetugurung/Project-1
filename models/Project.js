const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  technologies: [String],
  liveUrl: String,
  repoUrl: String,
  thumbnail: String,
  image:[String],
  views:{
    type:Number
,
default:0  }
},
{
  timestamps:true}

);

module.exports = mongoose.model("Project", projectSchema);
