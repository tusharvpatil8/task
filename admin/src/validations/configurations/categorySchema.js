import * as Yup from "yup";

export const CategoriesSchema = Yup.object().shape({
  categoryName: Yup.string().required(),
});
