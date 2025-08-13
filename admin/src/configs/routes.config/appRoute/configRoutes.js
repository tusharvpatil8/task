import React from "react";
import {
  CATEGORY_PREFIX_PATH,
  CONFIGURATION_PREFIX_PATH,
  WRITER_PREFIX_PATH,
} from "constants/route.constant";

const configRoutes = [
  {
    key: "apps.blogCategories",
    path: `${CONFIGURATION_PREFIX_PATH}${CATEGORY_PREFIX_PATH}`,
    component: React.lazy(() => import("views/configurations/categories")),
    authority: [],
  },
];

export default configRoutes;
