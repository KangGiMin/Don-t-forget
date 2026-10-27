import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import AuthLayout from "../components/AuthLayout";
import { getAuthErrorMessage } from "../api/accountApi";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const { colors } = useTheme();
  const handleLogin = async () => {
    if (!email.trim() || !password) return setError("이메일과 비밀번호를 입력해 주세요.");
    setLoading(true); setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); } catch (requestError) { setError(getAuthErrorMessage(requestError)); } finally { setLoading(false); }
  };
  return <AuthLayout title="로그인" subtitle="다시 온 걸 환영해요! 오늘도 차근차근 시작해 봐요.">
    <View style={styles.form}>
      <FormField placeholder="이메일을 입력하세요" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
      <FormField placeholder="비밀번호를 입력하세요" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={handleLogin} returnKeyType="go" />
      {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <ActionButton title="로그인" onPress={handleLogin} loading={loading} />
      <View style={styles.links}><LinkButton title="회원가입" onPress={() => navigation.navigate("Signup")} /><LinkButton title="아이디 찾기" onPress={() => navigation.navigate("FindId")} /><LinkButton title="비밀번호 찾기" onPress={() => navigation.navigate("FindPassword")} /></View>
    </View>
  </AuthLayout>;
}
const styles = StyleSheet.create({ form: { width: "100%" }, links: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginTop: 8, columnGap: 5 }, error: { marginBottom: 8, textAlign: "center" } });
