import { apiGet, apiPut } from "../../../services/api/client";
import { auth } from "../../../services/firebase/firebase";

function userPath() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("로그인이 필요합니다.");
  return "/users/" + encodeURIComponent(uid);
}
export function getProfile() { return apiGet(userPath()); }
export function saveProfile(profile) { return apiPut(userPath(), profile); }
