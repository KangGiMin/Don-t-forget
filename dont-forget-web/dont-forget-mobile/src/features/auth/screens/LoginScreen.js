import { useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { signInWithCustomToken, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { apiPut } from "../../../services/api/client";
import { API_URL } from "../../../services/api/config";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import AuthLayout from "../components/AuthLayout";
import { getAuthErrorMessage } from "../api/accountApi";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const styles = useReadableStyles(baseStyles);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false); const [loadingProvider, setLoadingProvider] = useState(""); const [error, setError] = useState("");
  const { colors } = useTheme();
  const handleLogin = async () => {
    if (!email.trim() || !password) return setError("이메일과 비밀번호를 입력해 주세요.");
    setLoading(true); setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); } catch (requestError) { setError(getAuthErrorMessage(requestError)); } finally { setLoading(false); }
  };

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    setError("");
    try {
      const returnUri = AuthSession.makeRedirectUri({ path: "social-auth" });
      const startUrl = `${API_URL}/auth/social/${provider}/start?platform=mobile&return_uri=${encodeURIComponent(returnUri)}`;
      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUri);
      if (result.type !== "success" || !result.url) return;

      const callbackUrl = new URL(result.url);
      const params = new URLSearchParams(callbackUrl.search);
      const fragmentParams = new URLSearchParams(callbackUrl.hash.slice(1));
      fragmentParams.forEach((value, key) => params.set(key, value));
      const providerError = params.get("social_error");
      if (providerError) throw new Error(providerError);
      const firebaseCustomToken = params.get("firebase_custom_token");
      if (!firebaseCustomToken) throw new Error("로그인 정보를 받지 못했습니다. 다시 시도해 주세요.");

      const credential = await signInWithCustomToken(auth, firebaseCustomToken);
      const displayName = params.get("display_name") || "친구";
      const photoURL = params.get("photo_url") || null;
      await updateProfile(credential.user, { displayName, photoURL });
      try {
        await apiPut(`/users/${encodeURIComponent(credential.user.uid)}`, {
          userName: displayName,
          statusMessage: "",
          profileImg: photoURL || "",
        });
      } catch (profileError) {
        console.warn("Social account profile was not saved.", profileError?.message);
      }
    } catch (requestError) {
      setError(requestError?.message || "소셜 로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingProvider("");
    }
  };
  return <AuthLayout title="로그인" subtitle="다시 온 걸 환영해요! 오늘도 차근차근 시작해 봐요.">
    <View style={styles.form}>
      <FormField placeholder="이메일을 입력하세요" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
      <FormField placeholder="비밀번호를 입력하세요" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={handleLogin} returnKeyType="go" />
      {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <ActionButton title="로그인" onPress={handleLogin} loading={loading} />
      <View style={styles.socialArea}>
        <Text style={[styles.socialLabel, { color: colors.muted }]}>간편 로그인</Text>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={Boolean(loadingProvider)}
          onPress={() => handleSocialLogin("naver")}
          style={[styles.socialButton, styles.naverButton, loadingProvider && styles.disabledButton]}
        >
          {loadingProvider === "naver" ? <ActivityIndicator color="#fff" /> : <Svg width={20} height={20} viewBox="0 0 24 24"><Path fill="#FFFFFF" d="M2 2h7l6 10V2h7v20h-7L9 12v10H2z" /></Svg>}
          <Text style={[styles.socialButtonText, styles.naverText]}>네이버 계정으로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={Boolean(loadingProvider)}
          onPress={() => handleSocialLogin("kakao")}
          style={[styles.socialButton, styles.kakaoButton, loadingProvider && styles.disabledButton]}
        >
          {loadingProvider === "kakao" ? <ActivityIndicator color="#191919" /> : <Svg width={21} height={21} viewBox="60 14 16 17"><Path fill="#191919" d="M68.001 16.5225C64.4222 16.5225 61.5225 19.0037 61.5225 22.0641C61.5225 24.0312 62.7219 25.7596 64.5292 26.7423L63.9181 29.2113C63.8954 29.285 63.9132 29.364 63.9619 29.4184C63.9975 29.457 64.0461 29.478 64.0931 29.478C64.1337 29.478 64.1742 29.464 64.2082 29.4341L66.834 27.5144C67.2117 27.5723 67.6007 27.6039 67.9994 27.6039C71.5767 27.6039 74.478 25.1226 74.478 22.0623C74.478 19.002 71.5783 16.5225 68.001 16.5225Z" /></Svg>}
          <Text style={[styles.socialButtonText, styles.kakaoText]}>카카오 계정으로 로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.links}><LinkButton title="회원가입" onPress={() => navigation.navigate("Signup")} /><LinkButton title="아이디 찾기" onPress={() => navigation.navigate("FindId")} /><LinkButton title="비밀번호 찾기" onPress={() => navigation.navigate("FindPassword")} /></View>
    </View>
  </AuthLayout>;
}
const baseStyles = StyleSheet.create({ form: { width: "100%" }, links: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginTop: 8, columnGap: 5 }, error: { marginBottom: 8, textAlign: "center" },
  socialArea: { gap: 10, marginTop: 18 },
  socialLabel: { textAlign: "center", fontSize: 12, fontWeight: "700", marginBottom: 2 },
  socialButton: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 9, paddingHorizontal: 12 },
  naverButton: { backgroundColor: "#03A94D" },
  kakaoButton: { backgroundColor: "#FEE500" },
  socialButtonText: { fontSize: 13, fontWeight: "800" },
  naverText: { color: "#FFFFFF" },
  kakaoText: { color: "#191919" },
  disabledButton: { opacity: 0.65 }, });
