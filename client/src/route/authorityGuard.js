import React from "react";
import { Navigate } from "react-router-dom";
import useAuthority from "../utils/hooks/useAuthority";
import { ACCESS_DENIED_PATH } from "../constants/route.constant";

const AuthorityGuard = (props) => {
  const { userAuthority = [], authority = [], children } = props;

  const roleMatched = useAuthority(userAuthority, authority);

  return roleMatched ? children : <Navigate to={ACCESS_DENIED_PATH} />;
};

export default AuthorityGuard;
