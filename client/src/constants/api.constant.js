

// ------- Project mode -----------------------------------------------------------------
export const REACT_APP_PROJECT_MODE = process.env.REACT_APP_PROJECT_MODE;

// ------- Dev URL -----------------------------------------------------------------
export const REACT_APP_BACKEND_DEV_URL = process.env.REACT_APP_BACKEND_DEV_URL;
export const REACT_APP_DEV_DOMAIN = process.env.REACT_APP_DEV_DOMAIN;
export const REACT_APP_WEBSITE_DEV_URL = process.env.REACT_APP_WEBSITE_DEV_URL;

// ------- Stage URL ---------------------------------------------------------------
export const REACT_APP_BACKEND_STAGE_URL =
  process.env.REACT_APP_BACKEND_STAGE_URL;
export const REACT_APP_STAGE_DOMAIN = process.env.REACT_APP_STAGE_DOMAIN;
export const REACT_APP_WEBSITE_STAGE_URL =
  process.env.REACT_APP_WEBSITE_STAGE_URL;

// ------- Prod URL -----------------------------------------------------------------
export const REACT_APP_BACKEND_PROD_URL =
  process.env.REACT_APP_BACKEND_PROD_URL;
export const REACT_APP_PROD_DOMAIN = process.env.REACT_APP_PROD_DOMAIN;
export const REACT_APP_WEBSITE_PROD_URL = process.env.REACT_APP_WEBSITE_PROD_URL;

export let BACKEND_SERVER_URL;
export let REACT_APP_DOMAIN;
export let WEBSITE_URL;

switch (REACT_APP_PROJECT_MODE) {
  case "development":
    BACKEND_SERVER_URL = REACT_APP_BACKEND_DEV_URL;
    REACT_APP_DOMAIN = REACT_APP_DEV_DOMAIN;
    WEBSITE_URL = REACT_APP_WEBSITE_DEV_URL;
    break;
  case "stage":
    BACKEND_SERVER_URL = REACT_APP_BACKEND_STAGE_URL;
    REACT_APP_DOMAIN = REACT_APP_STAGE_DOMAIN;
    WEBSITE_URL = REACT_APP_WEBSITE_STAGE_URL;
    break;
  case "production":
    BACKEND_SERVER_URL = REACT_APP_BACKEND_PROD_URL;
    REACT_APP_DOMAIN = REACT_APP_PROD_DOMAIN;
    WEBSITE_URL = REACT_APP_WEBSITE_PROD_URL;
    break;
  default:
    BACKEND_SERVER_URL = "";
    REACT_APP_DOMAIN = "";
    WEBSITE_URL = "";
    break;
}
