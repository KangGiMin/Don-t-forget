import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { resolveApiUrl } from "./resolveApiUrl";

export const API_URL = resolveApiUrl({
  configuredUrl: process.env.EXPO_PUBLIC_API_URL,
  metroHost: Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost,
  platform: Platform.OS,
  isDevice: Device.isDevice,
  isDevelopment: __DEV__,
  webHost: Platform.OS === "web" && typeof window !== "undefined" ? window.location.hostname : undefined,
});
export const API_CONFIG_ERROR = "백엔드 주소를 확인할 수 없습니다. 같은 Wi-Fi에서 Expo를 LAN 모드로 실행하거나 EXPO_PUBLIC_API_URL에 접근 가능한 서버 주소를 설정해 주세요.";
if (__DEV__) console.info("[API] backend:", API_URL || "not configured");
