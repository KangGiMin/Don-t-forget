import axios from "axios";
import { auth } from "../firebase/firebase";
import { API_URL } from "./config";

export async function authenticatedConfig(extraHeaders = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");
  return { headers: { ...extraHeaders, Authorization: "Bearer " + await user.getIdToken() } };
}
export async function apiGet(path) {
  return axios.get(API_URL + path, await authenticatedConfig());
}
export async function apiPost(path, body) {
  return axios.post(API_URL + path, body, await authenticatedConfig({ "Content-Type": "application/json" }));
}
export async function apiPut(path, body) {
  return axios.put(API_URL + path, body, await authenticatedConfig({ "Content-Type": "application/json" }));
}
export function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}
export async function apiDelete(path, body = {}) {
  return axios.delete(API_URL + path, { ...(await authenticatedConfig({ "Content-Type": "application/json" })), data: body });
}