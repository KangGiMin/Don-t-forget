export const APP_VERSION = "1.0.0";

export const ROUTES = {
  login: "/login",
  signup: "/signup",
  findId: "/find-id",
  findPassword: "/find-pw",
  todos: "/todo",
  profile: "/profile",
  contact: "/contact",
};

export const PROFILE_DEFAULTS = {
  name: "친구",
  statusMessage: "오늘 할 일을 내일로 미루지 말자!",
  imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
};

export const SUPPORTED_LANGUAGES = [
  { code: "ko", label: "🇰🇷 한국어" },
  { code: "en", label: "🇺🇸 English" },
  { code: "ja", label: "🇯🇵 日本語" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "th", label: "🇹🇭 ไทย" },
];
