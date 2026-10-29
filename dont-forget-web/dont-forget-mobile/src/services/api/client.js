import { create } from "axios";
import { auth } from "../firebase/firebase";
import { API_URL, API_CONFIG_ERROR } from "./config";

export const apiClient = create({ baseURL: API_URL, timeout: 15000 });
apiClient.interceptors.request.use((config) => {
  if (!API_URL) throw new Error(API_CONFIG_ERROR);
  return config;
});
apiClient.interceptors.response.use((response) => response, (error) => {
  if (!error.response && ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"].includes(error.code)) {
    error.message = "서버에 연결하지 못했습니다. PC의 백엔드 실행 상태와 PC·휴대폰의 Wi-Fi 연결을 확인해 주세요.";
    if (__DEV__) console.warn("[API] connection failed:", API_URL, error.code);
  }
  return Promise.reject(error);
});

export async function authenticatedConfig(extraHeaders = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");
  return { headers: { ...extraHeaders, Authorization: "Bearer " + await user.getIdToken() } };
}
export async function apiGet(path) {
  return apiClient.get(path, await authenticatedConfig());
}
export async function apiPost(path, body) {
  return apiClient.post(path, body, await authenticatedConfig({ "Content-Type": "application/json" }));
}
export async function apiPut(path, body) {
  return apiClient.put(path, body, await authenticatedConfig({ "Content-Type": "application/json" }));
}
export function getApiErrorMessage(error, fallback = "요청을 완료하지 못했습니다.") {
  return error?.response?.data?.message || error?.message || fallback;
}
export async function apiDelete(path, body = {}) {
  return apiClient.delete(path, { ...(await authenticatedConfig({ "Content-Type": "application/json" })), data: body });
}
