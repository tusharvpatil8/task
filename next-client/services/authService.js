import api from "./api";

export const signIn = (data) => {
  return api.post("/user/login", data);
};

export const signUp = (data) => {
  return api.post("/user/sign-up", data);
};