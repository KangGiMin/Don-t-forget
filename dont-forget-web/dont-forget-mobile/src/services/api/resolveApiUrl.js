// Explicit API URLs also support a backend hosted on a different computer.
export function resolveApiUrl({ configuredUrl, metroHost, platform, isDevice, isDevelopment, webHost }) {
  const explicit = configuredUrl?.trim();
  if (explicit) {
    try {
      const url = new URL(explicit);
      return ["http:", "https:"].includes(url.protocol) ? explicit.replace(/\/+$/, "") : "";
    } catch { return ""; }
  }
  if (!isDevelopment) return "";
  if (platform === "web" && webHost) return `http://${webHost}:3000/api`;
  if (metroHost) {
    try {
      const host = new URL(metroHost.includes("://") ? metroHost : `http://${metroHost}`).hostname;
      const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(host);
      // Expo tunnels expose Metro only, not the backend on port 3000.
      const tunnel = /\.(exp\.direct|expo\.dev|ngrok[^.]*\.(app|io))$/i.test(host);
      if (!loopback && !tunnel) return `http://${host}:3000/api`;
    } catch { /* Fall back only for emulators, never to a phone's localhost. */ }
  }
  if (!isDevice) return platform === "android" ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";
  return "";
}
