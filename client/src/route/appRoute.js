import React from "react";

const AppRoute = ({ component: Component, ...props }) => {
  return <Component {...props} />;
};

export default AppRoute;
