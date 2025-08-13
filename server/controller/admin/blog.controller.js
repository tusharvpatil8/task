const { CreateSlugString } = require("../../helpers/createSlug");
const blogService = require("../../services/blog.services");
const createError = require("http-errors");
const randomstring = require(`randomstring`);

module.exports = {
  addBlog: async (req, res, next) => {
    try {
      let blogData = req.body;
      console.log("blogData", blogData);

      const slugData = await CreateSlugString(
        `${blogData?.title
          .trim()
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("/", "-")}`,
        blogService
      );

      if (!blogData.blog_id) {
        blogData.blog_id = randomstring.generate(17);

        const existSlug = await blogService.findSlug(
          null,
          blogData.slug_url
        );
        if (existSlug) {
          return res.status(200).send({
            status: true,
            message: `Slug url is already exist. Please try again with another slug url`,
          });
        }
      }

      const existSlug = await blogService.findSlug(
        blogData.blog_id,
        slugData
      );
      if (existSlug) {
        return res.status(200).send({
          status: false,
          message:
            "Slug url is already exist. Please try again with another slug url",
        });
      }

    
      const createdBlog = await blogService.addBlog(blogData);
      if (!createdBlog) {
        return next(createError.InternalServerError("Error creating Blog."));
      }
      return res.status(200).send({
        success: true,
        message: "Blog added successfully.",
        data: createdBlog,
      });
    } catch (err) {
      next(err);
    }
  },

  editBlog: async (req, res, next) => {
    try {
      const blogId = req.params.id;
      const newData = req.body;
      const updatedBlog = await blogService.editBlog(blogId, newData);
      return res.status(200).send({
        success: true,
        message: "Blog updated successfully.",
        data: updatedBlog,
      });
    } catch (err) {
      next(err);
    }
  },

  changePublishStatus: async (req, res, next) => {
    try {
      const blogId = req.params.id;
      const status = req.params.status;
      const inactivatedBlog = await blogService.changePublishStatus(
        blogId,
        status
      );
      return res.status(200).send({
        success: true,
        message: "Blog Active Status updated successfully.",
        data: inactivatedBlog,
      });
    } catch (err) {
      next(err);
    }
  },

  getOneBlog: async (req, res, next) => {
    try {
      const blogId = req.params.id;
      const blog = await blogService.getOneBlog(blogId);
      return res.status(200).send({
        success: true,
        message: "Blog retrieved successfully.",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteBlog: async (req, res, next) => {
    try {
      const blogId = req.params.id;
      console.log("blogId",blogId)
      await blogService.deleteBlog(blogId);
      return res.status(200).send({
        success: true,
        message: "Blog deleted successfully.",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  },

  updateBlogPublishedStatus: async (req, res, next) => {
    try {
      const blogId = req.params.id;
      const blog = await blogService.updateBlogPublishedStatus(blogId);

      return res.status(200).send({
        success: true,
        message: "Blog status is updated successfully.",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllBlogs: async (req, res, next) => {
    try {
      const { pageNo = 1, perPage = 10 } = req.body;
      const status = req.params.status;
      const search = req?.body?.search;
      console.log("status",status);
      let filter = {};

      // if (req?.payload?.userRole !== "admin") {
      //   filter.published = true;
      // }

      if (status === "pending") {
        filter.isAdminApproved = false;
      }

      if (status === "approved") {
        filter.isAdminApproved = true;
      }

      const { blogList, count } = await blogService.getAllBlogs(
        search,
        parseInt(pageNo),
        parseInt(perPage),
        filter,

      );

      res.status(200).send({
        success: true,
        message: "Blogs retrieved successfully.",
        data: blogList,
        pagination: {
          count,
          perPage,
          pageNo,
          totalPages: Math.ceil(count / perPage),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getBlogBySlug: async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const blog = await blogService.getBlogBySlug(slug);
      const { pageNo, perPage } = req.body;

      // const ciphertext = await commonFunction.decode(encodedData.data);
      // console.log(" ciphertext:", ciphertext);

      const updatedBlog = await blogService.editBlog(blog.id, {
        blogReadCount: blog.blogReadCount + 1,
      });

      const getRelatedBlog = await blogService.getRelatedBlog(
        blog.category,
        pageNo,
        perPage
      );

      return res.status(200).send({
        success: true,
        message: "Blog retrieved successfully.",
        data: blog,
        relatedBlog: getRelatedBlog,
      });
    } catch (err) {
      next(err);
    }
  },

  // getBlogsByFilter: async (req, res, next) => {
  //   try {
  //     const { newBlogs, popularBlogs } = await blogService.getBlogsByFilter();

  //     res.status(200).send({
  //       success: true,
  //       message: "Blogs retrieved successfully.",
  //       newBlogs,
  //       popularBlogs,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  // getAllRelatedBlog: async (req, res, next) => {
  //   try {
  //     const { pageNo, perPage } = req.body;
  //     const blog_category = req.params.id;

  //     const { blogList, count } = await blogService.getRelatedBlog(
  //       blog_category,
  //       pageNo || 1,
  //       perPage || 10
  //     );
  //     res.status(200).send({
  //       success: true,
  //       message: "Blogs retrieved successfully.",
  //       data: blogList,
  //       pagination: {
  //         count: count,
  //         perPage: perPage || 10,
  //         pageNo: pageNo || 1,
  //         totalPages: Math.ceil(count / (perPage || 10)),
  //       },
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // },
};
