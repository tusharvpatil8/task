import React from "react";
import { BLOG_ADD_PREFIX_PATH, BLOG_DETAILS_PREFIX_PATH, BLOG_EDIT_PREFIX_PATH, BLOGS_PREFIX_PATH } from "constants/route.constant";


const blogRoutes = [
  {
    key: "apps.blogs",
    path: `${BLOGS_PREFIX_PATH}`,
    component: React.lazy(() => import("views/blogs")),
    authority: [],
  },
    {
    key: 'apps.addBlog',
    path: `${BLOGS_PREFIX_PATH}${BLOG_ADD_PREFIX_PATH}`,
    component: React.lazy(() =>
      import('views/blogs/components/AddBlog')
    ),
    authority: [],
  },
  {
    key: 'apps.editBlog',
    path: `${BLOGS_PREFIX_PATH}${BLOG_EDIT_PREFIX_PATH}/:id`,
    component: React.lazy(() => import('views/blogs/components/EditBlog')),
    authority: [],
  },

  {
    key: 'apps.detailsBlog',
    path: `${BLOGS_PREFIX_PATH}${BLOG_DETAILS_PREFIX_PATH}/:id`,
    component: React.lazy(() => import('views/blogs/components/DetailsBlog')),
    authority: [],
  },
];

export default blogRoutes;
