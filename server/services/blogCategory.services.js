const CategoryModel = require("../model/category.model"); // Adjust path to your model
const createError = require("http-errors");

module.exports = {
  // ✅ Add Category
  addCategory: async (reqData) => {
    try {
      const createdCategory = await CategoryModel.create(reqData);
      return createdCategory;
    } catch (err) {
      throw err;
    }
  },

  // ✅ Edit Category
  editCategory: async (categoryId, newData) => {
    try {
      const category = await CategoryModel.findById(categoryId).select(
        "-createdAt -updatedAt"
      );
      if (!category) {
        throw createError.BadRequest("Invalid category id.");
      }

      Object.assign(category, newData);
      await category.save();

      return category;
    } catch (err) {
      throw err;
    }
  },

  // ✅ Inactivate/Reactivate Category
  inactivateCategory: async (categoryId) => {
    try {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw createError.BadRequest("Invalid category id.");
      }

      category.active = !category.active;
      await category.save();

      return category;
    } catch (err) {
      throw err;
    }
  },

  // ✅ Get All Categories with Pagination
  getAllCategories: async (filter = {}, pageNo = 1, perPage = 10) => {
    try {
      const skip = (pageNo - 1) * perPage;

      const totalCount = await CategoryModel.countDocuments(filter);

      const categories = await CategoryModel.find(filter)
        .select("-createdAt -updatedAt")
        .sort({ createdAt: -1 }) // Show latest added first
        .skip(skip)
        .limit(perPage);

      return { totalCount, categories };
    } catch (err) {
      throw err;
    }
  },

  // ✅ Get One Category by ID
  getOneCategory: async (categoryId) => {
    try {
      const category = await CategoryModel.findById(categoryId).select(
        "-createdAt -updatedAt"
      );
      if (!category) {
        throw createError.BadRequest("Invalid category id.");
      }
      return category;
    } catch (err) {
      throw err;
    }
  },

  // ✅ Delete Category
  deleteCategory: async (categoryId) => {
    try {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw createError.BadRequest("Invalid category id.");
      }

      await category.deleteOne();

      return { message: "Category deleted successfully" };
    } catch (err) {
      throw err;
    }
  },
};
