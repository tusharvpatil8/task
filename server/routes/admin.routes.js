const express = require("express");
const router = express.Router();
const { ValidateBody } = require("../validation/validation.methods");
const validationSchema = require("../validation/validation.schemas");
const adminAuthController = require("../controller/admin/adminAuth.controller");
const blogController = require("../controller/admin/blog.controller");
const categoryController = require("../controller/admin/category.controller");
const { isAdminAuthentic } = require("../helpers/auth.helper");

// -------------------------- Admin Side Authentication -------------------------- //

router.get("/check-admin", adminAuthController.findAdmin);

router.post(
  "/sign-up",
  // ValidateBody(validationSchema.adminSchema),
  adminAuthController.createAdmin
);

router.post(
  "/login",
  ValidateBody(validationSchema.signInadminSchemas),
  adminAuthController.login
);

router.post(
  "/forgot-password",
  // ValidateBody(validationSchema.forgotPasswordSchema),
  adminAuthController.forgotPassword
);

router.get(
  "/reset-password/:token",
  // ValidateBody(validationSchema.resetForgotPasswordSchema),
  adminAuthController.resetForgottenPassword
);

//------------------------------ Blogs -------------------------//

router.post(
  "/add-blog",
  isAdminAuthentic,
  ValidateBody(validationSchema.blogSchema),
  blogController.addBlog
);

router.post(
  "/blog-list",
  isAdminAuthentic,
  blogController.getAllBlogs
);

router.put(
  "/blog/edit/:id",
  isAdminAuthentic,
  blogController.editBlog
);
router.delete(
  "/blog/delete/:id",
  isAdminAuthentic,
  blogController.deleteBlog
);
router.get("/blog/:id", blogController.getOneBlog);
router.patch(
  "/blog/status/:id",
  isAdminAuthentic,
  blogController.updateBlogPublishedStatus
);

//-------------------------------- Configurations -------------------------------//


//----------------- Blogs category ------------------//

router.post(
  "/category",
  ValidateBody(validationSchema.categorySchema),
  isAdminAuthentic,
  categoryController.add
);

router.put(
  "/category/:id",
  ValidateBody(validationSchema.categorySchema),
  isAdminAuthentic,
  categoryController.edit
);

router.get(
  "/categories/:status",
  isAdminAuthentic,
  categoryController.getAll
);

router.get(
  "/category/:id",
  isAdminAuthentic,
  categoryController.getOne
);

router.put(
  "/category/inactivate/:id",
  isAdminAuthentic,
  categoryController.inactivate
);

router.delete(
  "/category/:id",
  isAdminAuthentic,
  categoryController.delete
);


//----------------- Writers ------------------//


module.exports = router;
