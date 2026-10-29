import { useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import AuthLayout from "../components/AuthLayout";
import { requestPasswordReset } from "../api/accountApi";

export default function FindPasswordScreen({ navigation }) {
  const styles = useReadableStyles(baseStyles);
  const [email, setEmail] = useState(""); const [submitted, setSubmitted] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const handleReset = async () => {
    if (!email.trim()) return setError("이메일을 입력해 주세요.");
    setLoading(true); setError("");
    try { await requestPasswordReset(email); }
    catch (requestError) { if (!requestError?.code?.startsWith("auth/user-not-found")) { setError("요청을 처리하지 못했습니다. 이메일 형식과 네트워크 연결을 확인해 주세요."); setLoading(false); return; } }
    setSubmitted(true); setLoading(false);
  };
  return <AuthLayout title="비밀번호 찾기" subtitle="가입 이메일로 재설정 안내를 보내드립니다.">
    <View style={styles.form}>
      {submitted ? <Text accessibilityLiveRegion="polite" style={[styles.message, { color: colors.primaryStrong }]}>등록된 계정이면 비밀번호 재설정 안내를 받을 수 있습니다.</Text> : <>
        <FormField placeholder="가입한 이메일" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
        {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        <ActionButton title="재설정 이메일 보내기" onPress={handleReset} loading={loading} />
      </>}
      <LinkButton title="로그인으로 돌아가기" onPress={() => navigation.navigate("Login")} />
    </View>
  </AuthLayout>;
}
const baseStyles = StyleSheet.create({ form: { width: "100%" }, error: { marginBottom: 8, textAlign: "center" }, message: { lineHeight: 22, marginBottom: 14, textAlign: "center" } });
