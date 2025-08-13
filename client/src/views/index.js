import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { protectedRoutes, publicRoutes } from "../configs/routes.config";
import AuthorityGuard from "../route/authorityGuard";
import AppRoute from "../route/appRoute";
import ProtectedRoute from "../route/protectedRoute";
import PublicRoute from "../route/publicRoute";
import Spinner from "../components/ui/spinner";

const Views = () => {
  // check user authority to check route access
  const userAuthority = useSelector((state) => state.auth.user.authority);
  return (
    <Suspense fallback={<Spinner loading={true} />}>
      <Routes>

         {/* map public routes which are only access when user is not authenticated, 
        if user authentic then it will redirect to authenticated entrypath */}
        <Route path="/" element={<PublicRoute />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AppRoute
                  routeKey={route.key}
                  component={route.component}
                  {...route.meta}
                />
              }
            />
          ))}
        </Route>
        
        {/* map private routes which are only access when user is authenticated, 
        if user is not authentic then it will redirect to unauthenticated entrypath */}
        <Route path="/" element={<ProtectedRoute />}>
          {protectedRoutes.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <AppRoute
                    routeKey={route.key}
                    component={route.component}
                    {...route.meta}
                  />
                </AuthorityGuard>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
       
      </Routes>
    </Suspense>
  );
};

export default Views;
