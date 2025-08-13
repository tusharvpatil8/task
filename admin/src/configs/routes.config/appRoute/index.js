import blogRoutes from "./blogRoutes";
import configRoutes from "./configRoutes";

const appsRoute = [...blogRoutes, ...configRoutes];

export default appsRoute;
