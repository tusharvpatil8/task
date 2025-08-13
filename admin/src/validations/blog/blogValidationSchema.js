import * as Yup from "yup";

// --------- Blog Schema ---------//

export const BlogSchema = Yup.object().shape({
  title: Yup.string().required(),
  author: Yup.string().required(),
  categories: Yup.array()
    .of(Yup.string().required("Category must be a string")) 
    .min(1, "At least one category is required")
    .required("Categories are required"),
  readTime: Yup.string().required(),
  publishedDate: Yup.string().required(),
  slugUrl: Yup.string().required(),
  content: Yup.string().required(),
  image: Yup.string().required(),
  thumbnailImage: Yup.string().required(),
});
