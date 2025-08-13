const createError = require("http-errors");
const Blog = require("../model/blog.model");
const Category = require("../model/category.model");
const mongoose = require("mongoose");

async function BlogSearchQuery(search) {
  try {
    if (search) {
      const searchText = new RegExp(search, "i");
      return {
        $or: [
          { title: { $regex: searchText } },
          { content: { $regex: searchText } },
        ],
      };
    }
    return {};
  } catch (error) {
    console.error("BlogSearchQuery error:", error);
    return {};
  }
}

module.exports = {
  addBlog: async (reqData) => {
    try {
      const createdBlog = await Blog.create(reqData);
      if (!createdBlog) {
        throw createError.InternalServerError("Error Creating Blog");
      }
      return createdBlog;
    } catch (err) {
      throw err;
    }
  },

  editBlog: async (blogId, newData) => {
    console.log("blogId", blogId);
    console.log("newData", newData);
    try {
      const blog = await Blog.findOneAndUpdate({ _id: blogId }, newData, {
        new: true,
      });

      if (!blog) {
        throw createError.BadRequest("Invalid blog id.");
      }

      await blog.save();

      return blog;
    } catch (err) {
      throw err;
    }
  },

  // changePublishStatus: async (blogId, status) => {
  //   try {
  //     const blog = await Blog.update(
  //       { published: status },
  //       { where: { id: blogId }, returning: true }
  //     );
  //     if (!blog) {
  //       throw createError.BadRequest("Invalid blog id.");
  //     }

  //     return blog;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // getAllBlogsOfUser: async (userId) => {
  //   try {
  //     const blogList = await Blog.findAll({
  //       // where: { writerId: userId },
  //       attributes: { exclude: ["createdAt", "updatedAt"] },
  //     });
  //     return { blogList };
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  getOneBlog: async (blogId) => {
    console.log("🚀 ~ getOneBlog: ~ blogId:", blogId);
    try {
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw createError.BadRequest("Invalid blog ID format.");
      }

      const blog = await Blog.findById(blogId).select("-createdAt -updatedAt");
      if (!blog) {
        throw createError.BadRequest("Invalid blog id.");
      }

      const categoryIds = blog.category || [];
      console.log("🚀 ~ getOneBlog: ~ categoryIds:", categoryIds);

      const categories = await Category.find({
        _id: { $in: categoryIds },
      }).select("categoryName");

      const blogCategories = categories.map((category) => ({
        value: category._id,
        label: category.categoryName,
      }));

      return {
        ...blog.toObject(),
        blog_categories: blogCategories,
      };
    } catch (err) {
      throw err;
    }
  },

  // getBlogBySlug: async (slug) => {
  //   try {
  //     // Fetch the blog by slug
  //     const slugData = await Blog.findOne({
  //       where: { slug: slug },
  //       attributes: { exclude: ["createdAt", "updatedAt"] },
  //     });

  //     if (!slugData) {
  //       throw createError.BadRequest("Invalid slug.");
  //     }

  //     // Get the category IDs from the blog
  //     const categoryIds = slugData.category; // Assuming category is an array of IDs

  //     // Fetch categories that match the IDs
  //     const categories = await Categories.findAll({
  //       where: {
  //         id: categoryIds,
  //       },
  //       attributes: ["id", "categoryName"], // Only fetch necessary fields
  //     });

  //     // Transform categories into the desired format
  //     const blogCategories = categories.map((category) => ({
  //       value: category.id,
  //       label: category.categoryName,
  //     }));

  //     // Add formatted categories to the result
  //     return {
  //       ...slugData.toJSON(),
  //       blog_categories: blogCategories,
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // getRelatedBlog: async (blog_category_id, page_no, page_per) => {
  //   if (!Array.isArray(blog_category_id)) {
  //     if (typeof blog_category_id === "string") {
  //       blog_category_id = [blog_category_id];
  //     } else {
  //       throw new Error("Expected blog_category_id to be an array or a string");
  //     }
  //   }
  //   try {
  //     const queryOptions = {
  //       where: {
  //         published: true,
  //         [Sequelize.Op.or]: blog_category_id.map((id) => ({
  //           category: { [Sequelize.Op.contains]: [id] },
  //         })),
  //       },
  //       attributes: ["title", "publishedDate", "content", "image", "slug"],
  //       order: [["publishedDate", "DESC"]],
  //       limit: page_per ? Number(page_per) : undefined,
  //       offset:
  //         page_no && page_per
  //           ? (Number(page_no) - 1) * Number(page_per)
  //           : undefined,
  //     };

  //     const { count, rows: blogList } = await Blog.findAndCountAll(
  //       queryOptions
  //     );
  //     const pagination = {
  //       count: count,
  //       perPage: page_per || 10,
  //       pageNo: page_no || 1,
  //       totalPages: Math.ceil(count / (page_per || 10)),
  //     };
  //     return { blogList, pagination };
  //   } catch (error) {
  //     console.error("Error fetching related blogs: ", error);
  //     throw error;
  //   }
  // },

  findSlug: async (id, slug_url) => {
    try {
      const blog = await Blog.findOne(
        {
          blog_id: { $nin: [id] },
          slug_url,
          active: true,
        },
        { __v: 0 }
      );
      return blog;
    } catch (error) {
      console.error("Error in findSlug:", error);
      throw error;
    }
  },

  checkSlug: async (slug_url) => {
    try {
      const count = await Blog.countDocuments({ slug_url, active: true });
      return count;
    } catch (error) {
      console.error("Error in checkSlug:", error);
      throw error;
    }
  },

  deleteBlog: async (blogId) => {
    console.log("blogId", blogId);
    try {
      const blog = await Blog.deleteOne({ _id: blogId }); // ✅ FIXED
      if (!blog || blog.deletedCount === 0) {
        throw createError.BadRequest("Invalid blog id.");
      }
      return { message: "Blog deleted successfully." };
    } catch (err) {
      throw err;
    }
  },

  // ApprovedByAdmin: async (blogId, status) => {
  //   try {
  //     const blog = await Blog.update(
  //       { isAdminApproved: status },
  //       { where: { id: blogId }, returning: true }
  //     );
  //     if (!blog) {
  //       throw createError.BadRequest("Invalid blog id.");
  //     }
  //     return blog;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // getAllBlogs: async (pageNo, perPage, filter) => {
  //   try {
  //     const skip = (pageNo - 1) * perPage;

  //     // Fetch blogs with pagination
  //     const [blogList, count] = await Promise.all([
  //       Blog.find(filter)
  //         .skip(skip)
  //         .limit(perPage)
  //         .lean(), // Converts Mongoose documents to plain JS objects
  //       Blog.countDocuments(filter),
  //     ]);

  //     // Fetch categories and format
  //     const blogsWithCategories = await Promise.all(
  //       blogList.map(async (blog) => {
  //         const categoryIds = blog.category || [];

  //         const categories = await Category.find({
  //           _id: { $in: categoryIds },
  //         }).select("categoryName");

  //         const blog_categories = categories.map((cat) => ({
  //           value: cat._id,
  //           label: cat.categoryName,
  //         }));

  //         return {
  //           ...blog,
  //           blog_categories,
  //         };
  //       })
  //     );

  //     return { blogList: blogsWithCategories, count };
  //     // return { blogList, count };
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  getAllBlogs: async (search, pageNo, perPage, filter) => {
    try {
      const skip = (pageNo - 1) * perPage;
console.log("skip",skip)
      const searchQuery = await BlogSearchQuery(search);
      console.log("searchQuery : ", JSON.stringify(searchQuery));
       const finalQuery = { ...filter, ...searchQuery };

      const blogsWithCategories = await Blog.aggregate([
        { $match: finalQuery },
        // { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "blog_categories",
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            author: 1,
            createdAt: 1,
            publishedDate: 1,
            published: 1,
            image: 1,
            thumbnailImage: 1,
            blog_categories: {
              $map: {
                input: "$blog_categories",
                as: "cat",
                in: {
                  value: "$$cat._id",
                  label: "$$cat.categoryName",
                },
              },
            },
          },
        },
      ]);

      const count = await Blog.countDocuments(filter);

      return { blogList: blogsWithCategories, count };
    } catch (err) {
      throw err;
    }
  },

  // getBlogsByFilter: async () => {
  //   try {
  //     // Fetch the latest 3 published blogs
  //     const newBlogs = await Blog.findAll({
  //       where: { published: true, active: true },
  //       order: [["publishedDate", "DESC"]],
  //       attributes: ["publishedDate", "title", "slug"],
  //       limit: 3,
  //     });

  //     // Fetch the 3 most popular blogs based on blogReadCount
  //     const popularBlogs = await Blog.findAll({
  //       where: { published: true, active: true },
  //       order: [["blogReadCount", "DESC"]],
  //       attributes: ["publishedDate", "title", "slug"],
  //       limit: 3,
  //     });

  //     // Return both sets of blogs
  //     return {
  //       newBlogs,
  //       popularBlogs,
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // getAllApprovedBlogsOfDentist: async (pageNo, perPage, dentistId) => {
  //   try {
  //     const { count, rows: blogList } = await Blog.findAndCountAll({
  //       where: {
  //         // writerId: dentistId,
  //         isAdminApproved: true,
  //       },
  //       limit: perPage,
  //       offset: perPage * (pageNo - 1),
  //       // include: [
  //       //   {
  //       //     model: Dentist, // Assuming you have a Dentist model
  //       //     as: 'writer',
  //       //     attributes: ['firstName', 'middleName', 'lastName', 'mobile', 'email', 'profileImage'],
  //       //   },
  //       // ],
  //     });
  //     return { blogList, count };
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // checkSlug: async (slug) => {
  //   try {
  //     const count = await Blog.count({
  //       where: {
  //         slug: slug,
  //       },
  //     });
  //     console.log(" count:", count);
  //     return count;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  updateBlogPublishedStatus: async (blogId) => {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw createError.BadRequest("Invalid blog id.");
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { published: !blog.published },
        { new: true, select: "-createdAt -updatedAt" }
      );

      return updatedBlog;
    } catch (err) {
      throw err;
    }
  },
};
