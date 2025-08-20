const validate = require("./validation");
const Joi = require("joi");

module.exports = {
  // ----------------- User Schema ----------------------------------------------

  userSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.string,
    user_name: validate.reqString,
    role: validate.reqString,
  }),

  signInUserSchemas: Joi.object()
    .keys({
      email: validate.string,
      password: validate.reqString,
    })
    .or("email", "id"),
    
  // ----------------- Admin Schema ----------------------------------------------

  signInadminSchemas: Joi.object()
    .keys({
      email: validate.string,
      password: validate.reqString,
    })
    .or("email", "id"),

  adminSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.string,
  }),

  forgotPasswordSchema: Joi.object().keys({
    email: validate.email,
  }),

  resetForgotPasswordSchema: Joi.object().keys({
    password: validate.reqString,
    // email: validate.email,
  }),

  // ----------------- Blog Schema ----------------------------------------------

  blogSchema: Joi.object().keys({
    blog_id: validate.string,
    title: validate.reqString,
    author: validate.reqString,
    category: validate.reqArrayString,
    readTime: validate.reqString,
    publishedDate: validate.reqDate,
    content: validate.reqString,
    slug_url: validate.string,
    image: validate.reqString,
    thumbnailImage: validate.reqString,
    published: validate.boolean,
  }),

  categorySchema: Joi.object().keys({
    categoryName: validate.reqString,
  }),


  // ----------------- Task Schema ----------------------------------------------

  taskSchema: Joi.object().keys({
    task_id: validate.string,
    title: validate.reqString,
    author: validate.reqString,
    publishedDate: validate.reqDate,
    content: validate.reqString,
    image: validate.reqString,
    thumbnailImage: validate.reqString,
  }),
};
