const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userAuth.controller")
const blogController = require("../controller/admin/blog.controller");
const taskController = require("../controller/user/task.controller")
const { ValidateBody } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isUserAuthentic } = require("../helpers/auth.helper");
const validationSchemas = require("../validation/validation.schemas");

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

// -------------------------- Tasks -------------------------- //

router.post(
  "/add-task",
  isUserAuthentic,
  ValidateBody(validationSchemas.taskSchema),
  taskController.addTask
);

router.put(
  "/task/edit/:id",
  isUserAuthentic,
  taskController.editTask
);

router.delete(
  "/task/delete/:id",
   isUserAuthentic,
  taskController.deleteTask
);
router.get("/task/:id",
  isUserAuthentic,
   taskController.getOneTask);

router.post("/all-tasks", 
  isUserAuthentic,
  taskController.getAllTask);


router.post("/all-blogs", 
  isUserAuthentic,
  blogController.getAllBlogs);

module.exports = router;
