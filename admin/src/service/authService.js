import api from "service/api";

export function isAdminExists() {
  return api.get("/admin/check-admin");
}
export function signUp(data) {
  return api.post("/admin/sign-up", data);
}

export function login(data) {
  return api.post("/admin/login", data);
}

export function forgotPassword(data) {
  return api.post(`/admin/forgot-password`, data);
}

export function verifyOTP(data) {
  return api.post(`/auth/verify-otp`, data);
}

export function resetPassword(data) {
  return api.post(`/auth/reset-password`, data);
}
