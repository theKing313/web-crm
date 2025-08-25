import Cookies from "js-cookie";
// import { api } from "./api";

export async function checkAuth() {
  const token = Cookies.get("token");
  if (!token) return false;
  return true;
}

export function logout() {
  Cookies.remove("token");
  window.location.href = "/login";
}
