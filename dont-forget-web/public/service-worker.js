self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (_) { payload = { body: event.data?.text() || "마감 시간이 가까워요." }; }
  event.waitUntil(self.registration.showNotification(payload.title || "돈폴겟", {
    body: payload.body || "할 일 마감 시간이 가까워요.",
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: payload.data || { route: "todo" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const target = new URL("/todo", self.location.origin).href;
    const existing = windows.find((windowClient) => windowClient.url.startsWith(self.location.origin));
    return existing ? existing.navigate(target).then(() => existing.focus()) : clients.openWindow(target);
  }));
});
