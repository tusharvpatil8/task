const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
   
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Category", CategorySchema);
