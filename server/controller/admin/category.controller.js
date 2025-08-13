const {
  addCategory,
  editCategory,
  getAllCategories,
  getOneCategory,
  deleteCategory,
  inactivateCategory,
} = require("../../services/blogCategory.services"); 

module.exports = {
  add: async (req, res, next) => {
    try {
      const reqData = req.body;

      const category = await addCategory(reqData);

      return res.status(200).send({
        success: true,
        message: "Category added successfully.",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    try {
      const reqData = req.body;
      const id = req.params.id;
      console.log("id",id);

      const category = await editCategory(id, reqData);

      return res.status(200).send({
        success: true,
        message: "Category updated successfully.",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { pageNo, perPage } = req.query;
      const status = req.params.status;
      let filter = {};
      if (status === "active") filter = { active: true };
      if (status === "inactive") filter = { active: false };

      const { totalCount, categories } = await getAllCategories(
        filter,
        parseInt(pageNo) || 1,
        parseInt(perPage) || 10
      );
      return res.status(200).send({
        success: true,
        message: "All categories retrieved successfully.",
        data: categories,
        pagination: {
          count: totalCount,
          perPage: parseInt(perPage) || 10,
          pageNo: parseInt(pageNo) || 1,
          totalPages: Math.ceil(totalCount / (parseInt(perPage) || 10)),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await getOneCategory(id);
      return res.status(200).send({
        success: true,
        message: "Category retrieved successfully.",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  },

  inactivate: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await inactivateCategory(id);

      return res.status(200).send({
        success: true,
        message: "Category deactivated successfully.",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      await deleteCategory(id);

      return res.status(200).send({
        success: true,
        message: "Category deleted successfully.",
        data: [],
      });
    } catch (err) {
      next(err);
    }
  },
};
