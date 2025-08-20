import { ROOT, TASK_PREFIX_PATH } from "../constants/route.constant";

const appConfig = {
  authenticatedEntryPath: ROOT,
  unAuthenticatedEntryPath: ROOT,
  taskEntryPath: TASK_PREFIX_PATH,
  enableMock: true,
};

export default appConfig;
