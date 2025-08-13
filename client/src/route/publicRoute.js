import React from "react";
import { Outlet } from "react-router-dom";

const PublicRoute = () => {
  console.log("PublicRoute");
  return <Outlet />;
};

export default PublicRoute;
