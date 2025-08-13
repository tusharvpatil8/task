import authRoute from "./authRoute";
import appsRoute from "./appsRoute";
import publicRoute from "./publicRoute";

export const authRoutes = [...authRoute];
export const publicRoutes = [...publicRoute];
export const protectedRoutes = [...appsRoute];
