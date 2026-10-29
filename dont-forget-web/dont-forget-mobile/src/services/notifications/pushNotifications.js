import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { apiPost } from "../api/client";


export async function registerExpoPushNotifications() {
  if (Platform.OS === "web") return { success: false, message: "웹에서는 브라우저 푸시 설정을 사용해 주세요." };
  if (!Device.isDevice) return { success: false, message: "푸시 알림 등록은 실제 기기에서 사용할 수 있습니다." };
  if (Constants.expoGoConfig) {
    return {
      success: false,
      message: "Android Expo Go에서는 원격 푸시 알림을 테스트할 수 없습니다. 푸시 알림을 확인하려면 development build를 설치해 주세요.",
    };
  }

  let Notifications;
  try {
    Notifications = await import("expo-notifications");
  } catch (error) {
    return {
      success: false,
      message: error?.message || "알림 모듈을 불러오지 못했습니다. Expo SDK와 네이티브 빌드 버전을 확인해 주세요.",
    };
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return { success: false, message: "기기 알림 권한이 허용되지 않았습니다." };
  if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("default", { name: "기본 알림", importance: Notifications.AndroidImportance.HIGH, vibrationPattern: [0, 250, 250, 250], lightColor: "#2B6CB0" });
  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  if (!projectId) return { success: false, message: "EAS projectId를 app.json에 설정해야 푸시 토큰을 만들 수 있습니다." };
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await apiPost("/notifications/expo-token", { token, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul", deviceId: Device.osBuildId || Device.modelId || Platform.OS });
    return { success: true, message: "모바일 푸시 알림을 등록했습니다." };
  } catch (error) { return { success: false, message: error?.response?.data?.message || error?.message || "푸시 알림을 등록하지 못했습니다." }; }
}
