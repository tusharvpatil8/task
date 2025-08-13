require("dotenv").config();

module.exports = {
  // ------------ Server PORT And Type ---------------------------------
  PORT: process.env.PORT,
  PROJECT_MODE: process.env.PROJECT_MODE,
  

  // ------------ Mongodb URL -------------------------------------------
  MONGODB_DEV_URL: process.env.MONGODB_DEV_URL,
  MONGODB_STAGE_URL: process.env.MONGODB_STAGE_URL,
  MONGODB_PROD_URL: process.env.MONGODB_PROD_URL,

  // ------------ JWT And Crypto-js Sceret Key -----------------------------
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  // ------------ Admin Panel URL ---------------------------------------------------
  CLIENT_HOST: process.env.CLIENT_HOST,
};
