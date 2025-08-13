import authRoute from "./authRoute";
import appsRoute from "./appRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [...appsRoute];
