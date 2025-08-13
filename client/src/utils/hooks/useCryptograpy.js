import CryptoJS from "crypto-js";
import {
  BACKEND_SERVER_URL,
  CRYPTO_JS_SECRET_KEY,
} from "../../constants/api.constant";

const useCryptograpy = () => {
  const backendUrl = BACKEND_SERVER_URL;
  const encrypt = async (text) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (backendUrl === "http://localhost:3001/") {
          return resolve(text);
        } else {
          const data = CryptoJS.AES.encrypt(
            JSON.stringify(text),
            CRYPTO_JS_SECRET_KEY
          ).toString();
          return resolve(data);
        }
      } catch (error) {
        return resolve({
          status: false,
          message: "Something is wrong." + error.message,
        });
      }
    });
  };

  const decrypt = async (text, option = 0) => {
    return new Promise(async (resolve) => {
      try {
        if (backendUrl === "http://localhost:3001/") {
          return resolve(text);
        } else {
          var bytes = CryptoJS.AES.decrypt(text, CRYPTO_JS_SECRET_KEY);
          var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          if (option) {
            return resolve({ status: true, data: originalText });
          } else {
            return resolve(originalText);
          }
        }
      } catch (error) {
        return resolve({
          status: false,
          message: "Something is wrong while send request." + error.message,
        });
      }
    });
  };

  return { encrypt, decrypt };
};

export default useCryptograpy;
