import React from "react";
import { ACCESS_DENIED_PATH } from "../../constants/route.constant";

const appsRoute = [
  {
    key: "accessDenied",
    path: `${ACCESS_DENIED_PATH}`,
    component: React.lazy(() => import("../../views/access-denied")),
    authority: [],
  },
];

export default appsRoute;
