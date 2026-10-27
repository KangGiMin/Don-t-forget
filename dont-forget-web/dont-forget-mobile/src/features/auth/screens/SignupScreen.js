import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import AuthLayout from "../components/AuthLayout";
import { getAuthErrorMessage, registerAccount } from "../api/accountApi";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const { colors } = useTheme();
  const handleSignup = async () => {
    if (!email.trim() || !password || !name.trim()) return setError("이메일, 비밀번호, 이름을 모두 입력해 주세요.");
    if (password.length < 10) return setError("비밀번호는 10자 이상이어야 합니다.");
    if (name.trim().length > 60) return setError("이름은 60자 이내로 입력해 주세요.");
    setLoading(true); setError("");
    try { await registerAccount({ email, password, name }); } catch (requestError) { setError(getAuthErrorMessage(requestError)); } finally { setLoading(false); }
  };
  return <AuthLayout title="회원가입" subtitle="새 계정을 만들어 할 일을 정리해 보세요.">
    <View style={styles.form}>
      <FormField placeholder="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <FormField placeholder="비밀번호 (10자 이상)" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" />
      <FormField placeholder="이름 또는 닉네임" value={name} onChangeText={setName} maxLength={60} autoComplete="name" returnKeyType="done" onSubmitEditing={handleSignup} />
      {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <ActionButton title="가입하기" onPress={handleSignup} loading={loading} />
      <LinkButton title="이미 계정이 있어요 · 로그인" onPress={() => navigation.navigate("Login")} />
    </View>
  </AuthLayout>;
}
const styles = StyleSheet.create({ form: { width: "100%" }, error: { marginBottom: 8, textAlign: "center" } });
