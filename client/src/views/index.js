import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "../configs/routes.config";
import AppRoute from "../route/appRoute";
import PublicRoute from "../route/publicRoute";
import Spinner from "../components/ui/spinner";

const Views = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[300px]">
          <Spinner loading={true} size={32} />
        </div>
      }
    >
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
      </Routes>
    </Suspense>
  );
};

export default Views;
