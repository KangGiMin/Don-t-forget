import { apiUrl } from "@/shared/config/api";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";

function decodeVapidKey(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export async function registerBrowserPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return { success: false, message: "이 브라우저는 푸시 알림을 지원하지 않습니다." };
  }
  if (!window.isSecureContext) return { success: false, message: "브라우저 푸시는 HTTPS 연결에서 사용할 수 있습니다." };
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { success: false, message: "브라우저 알림 권한이 허용되지 않았습니다." };
  const keyResponse = await fetch(apiUrl("/notifications/vapid-public-key"));
  const keyResult = await keyResponse.json();
  if (!keyResult.publicKey) return { success: false, message: "서버 Web Push 키 설정이 필요합니다." };
  await navigator.serviceWorker.register("/service-worker.js");
  const registration = await navigator.serviceWorker.ready;
  const applicationServerKey = decodeVapidKey(keyResult.publicKey);
  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const currentKey = subscription.options?.applicationServerKey;
    const currentKeyBytes = currentKey ? new Uint8Array(currentKey) : null;
    const sameKey = currentKeyBytes
      && currentKeyBytes.length === applicationServerKey.length
      && currentKeyBytes.every((byte, index) => byte === applicationServerKey[index]);

    if (!sameKey) {
      await subscription.unsubscribe();
      subscription = null;
    }
  }

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }
  const response = await fetch(apiUrl("/notifications/web-subscription"), {
    method: "POST",
    headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ subscription: subscription.toJSON(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul" }),
  });
  const result = await response.json();
  if (!result.success) return { success: false, message: result.message || "브라우저 알림을 등록하지 못했습니다." };
  return { success: true, message: result.configured ? "브라우저 푸시 알림을 켰습니다." : "구독은 저장했지만 서버 VAPID 키 설정이 필요합니다." };
}

// Keep the immediate in-page task feedback separate from scheduled push reminders.
export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") return Notification.requestPermission();
  return Promise.resolve("Notification" in window ? Notification.permission : "unsupported");
};

export const sendNotification = (title, body) => {
  if ("Notification" in window && Notification.permission === "granted") {
    navigator.serviceWorker?.ready.then((registration) => registration.showNotification(title, { body, icon: "/favicon.png" })).catch(() => new Notification(title, { body, icon: "/favicon.png" }));
  }
};

