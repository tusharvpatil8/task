const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema(
  {
    task_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  
    publishedDate: {
      type: Date,
    },
    content: {
      type: String,
      required: true,
    },
    slug_url: {
      type: String,
    },
    image: {
      type: String,
      default: `https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80`,
      trim: true,
    },
    thumbnailImage: {
      type: String,
      default: `https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80`,
      trim: true,
    },

    
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TasksSchema);
