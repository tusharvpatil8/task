import React from "react";
import { ROOT } from "../../constants/route.constant";

const publicRoute = [
  {
    key: "home",
    path: `${ROOT}`,
    component: React.lazy(() => import("../../views/home")),
    authority: [],
  },

    {
    key: "blogs",
    path: `/blogs`,
    component: React.lazy(() => import("../../views/blogs")),
    // authority: [USER],
    header: true,
    footer: true,
  },
  {
    key: "blog-details",
    path: `/blogs/blog-details/:slug`,
    component: React.lazy(() => import("../../views/blogs/components/blogDetails")),
    header: true,
    footer: true,
  },

      {
    key: "task",
    path: `/task`,
    component: React.lazy(() => import("../../views/task")),
    // authority: [USER],
    header: true,
    footer: true,
  },
];

export default publicRoute;
