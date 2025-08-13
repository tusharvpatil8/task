import axios from "axios";
import deepParseJson from "../utils/deepParseJson";
import { PERSIST_STORE_NAME } from "../constants/app.constant";
import { BACKEND_SERVER_URL } from "../constants/api.constant";
const api = axios.create({
  baseURL: BACKEND_SERVER_URL,
});
const publicAPIs = ["/login"];
// Add a request interceptor
api.interceptors.request.use(
  async function (config) {
    if (publicAPIs.includes(config.url)) {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
    } else {
      const rawPersistData = await localStorage.getItem(PERSIST_STORE_NAME);
      const persistData = deepParseJson(rawPersistData);
      const token = persistData?.auth?.session?.token;
      config.headers = {
        Authorization: `${token}`,
        "Content-Type": "application/json; charset=utf-8",
      };
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  async function (response) {
    // Do something with response data
    const result = response.data;
    return result;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default api;
