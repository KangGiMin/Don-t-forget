import axios from "axios";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { apiPut } from "../../../services/api/client";
import { API_URL } from "../../../services/api/config";

export async function registerAccount({ email, password, name }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  try {
    await apiPut("/users/" + encodeURIComponent(credential.user.uid), { userName: name.trim(), statusMessage: "", profileImg: "" });
  } catch (error) {
    console.warn("Account created, but its profile record could not be saved.", error?.message);
  }
  return credential.user;
}

export function requestPasswordReset(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function requestIdLookup(name) {
  const { data } = await axios.post(API_URL + "/find-id", { name: name.trim() });
  return data;
}

export function getAuthErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "이미 가입된 이메일입니다.",
    "auth/invalid-email": "이메일 주소를 확인해 주세요.",
    "auth/weak-password": "비밀번호는 10자 이상이어야 합니다.",
    "auth/invalid-credential": "이메일 또는 비밀번호를 확인해 주세요.",
    "auth/user-not-found": "등록된 계정을 찾을 수 없습니다.",
    "auth/wrong-password": "이메일 또는 비밀번호를 확인해 주세요.",
    "auth/network-request-failed": "네트워크 연결을 확인해 주세요.",
  };
  return messages[error?.code] || error?.response?.data?.message || "요청을 완료하지 못했습니다. 입력 정보와 서버 연결을 확인해 주세요.";
}
