const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userAuth.controller")
const blogController = require("../controller/admin/blog.controller");
const taskController = require("../controller/user/task.controller")
const { ValidateBody } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");

// -------------------------- User Side Authentication -------------------------- //

router.post(
  "/sign-up",
  ValidateBody(schemas.userSchema),
  userController.registerUser
);

router.post(
  "/login",
  ValidateBody(schemas.signInUserSchemas),
  userController.login
);

// -------------------------- Blogs -------------------------- //

router.post(
  "/add-task",
  // isAdminAuthentic,
  // ValidateBody(validationSchema.blogSchema),
  taskController.addTask
);

router.put(
  "/task/edit/:id",
  // isAdminAuthentic,
  taskController.editTask
);

router.delete(
  "/task/delete/:id",
  // isAdminAuthentic,
  taskController.deleteTask
);
router.get("/task/:id", taskController.getOneTask);

router.post("/all-tasks", taskController.getAllTask);


router.post("/all-blogs", blogController.getAllBlogs);

module.exports = router;
