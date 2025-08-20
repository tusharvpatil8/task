import axios from "axios";
import deepParseJson from "../utils/deepParseJson";
import { PERSIST_STORE_NAME } from "../constants/app.constant";
import { BACKEND_SERVER_URL } from "../constants/api.constant";

const api = axios.create({
  baseURL: BACKEND_SERVER_URL,
});

const publicAPIs = ["/login"];

// ✅ Request Interceptor
api.interceptors.request.use(
  async function (config) {
    if (publicAPIs.includes(config.url)) {
      // Public APIs
      config.headers = {
        ...config.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
    } else {
      // Private APIs
      const rawPersistData = await localStorage.getItem(PERSIST_STORE_NAME);
      const persistData = deepParseJson(rawPersistData);
      const token = persistData?.auth?.session?.token;

      config.headers = {
        ...config.headers,
        Authorization: `${token}`,
      };

      // ⚠️ Only set JSON content-type if not FormData
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json; charset=utf-8";
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  async function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
