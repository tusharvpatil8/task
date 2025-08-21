// ------- Project mode -----------------------------------------------------------------
export const NEXT_PUBLIC_PROJECT_MODE = process.env.NEXT_PUBLIC_PROJECT_MODE;

// ------- Dev URL -----------------------------------------------------------------
export const NEXT_PUBLIC_BACKEND_DEV_URL = process.env.NEXT_PUBLIC_BACKEND_DEV_URL;
export const NEXT_PUBLIC_DEV_DOMAIN = process.env.NEXT_PUBLIC_DEV_DOMAIN;
export const NEXT_PUBLIC_WEBSITE_DEV_URL = process.env.NEXT_PUBLIC_WEBSITE_DEV_URL;

// ------- Stage URL ---------------------------------------------------------------
export const NEXT_PUBLIC_BACKEND_STAGE_URL =
  process.env.NEXT_PUBLIC_BACKEND_STAGE_URL;
export const NEXT_PUBLIC_STAGE_DOMAIN = process.env.NEXT_PUBLIC_STAGE_DOMAIN;
export const NEXT_PUBLIC_WEBSITE_STAGE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_STAGE_URL;

// ------- Prod URL -----------------------------------------------------------------
export const NEXT_PUBLIC_BACKEND_PROD_URL =
  process.env.NEXT_PUBLIC_BACKEND_PROD_URL;
export const NEXT_PUBLIC_PROD_DOMAIN = process.env.NEXT_PUBLIC_PROD_DOMAIN;
export const NEXT_PUBLIC_WEBSITE_PROD_URL = process.env.NEXT_PUBLIC_WEBSITE_PROD_URL;

export let BACKEND_SERVER_URL;
export let NEXT_PUBLIC_DOMAIN;
export let WEBSITE_URL;

switch (NEXT_PUBLIC_PROJECT_MODE) {
  case "development":
    BACKEND_SERVER_URL = NEXT_PUBLIC_BACKEND_DEV_URL;
    NEXT_PUBLIC_DOMAIN = NEXT_PUBLIC_DEV_DOMAIN;
    WEBSITE_URL = NEXT_PUBLIC_WEBSITE_DEV_URL;
    break;
  case "stage":
    BACKEND_SERVER_URL = NEXT_PUBLIC_BACKEND_STAGE_URL;
    NEXT_PUBLIC_DOMAIN = NEXT_PUBLIC_STAGE_DOMAIN;
    WEBSITE_URL = NEXT_PUBLIC_WEBSITE_STAGE_URL;
    break;
  case "production":
    BACKEND_SERVER_URL = NEXT_PUBLIC_BACKEND_PROD_URL;
    NEXT_PUBLIC_DOMAIN = NEXT_PUBLIC_PROD_DOMAIN;
    WEBSITE_URL = NEXT_PUBLIC_WEBSITE_PROD_URL;
    break;
  default:
    BACKEND_SERVER_URL = "";
    NEXT_PUBLIC_DOMAIN = "";
    WEBSITE_URL = "";
    break;
}
