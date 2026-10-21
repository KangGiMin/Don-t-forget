import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { requestPasswordReset } from "../api/accountApi";

export default function FindPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return setError("이메일을 입력해 주세요.");
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email);
    } catch (requestError) {
      // Keep this message generic so the screen does not reveal whether an account exists.
      if (!requestError?.code?.startsWith("auth/user-not-found")) {
        setError("요청을 처리하지 못했습니다. 이메일 형식과 네트워크 연결을 확인해 주세요.");
        setLoading(false);
        return;
      }
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.subtitle}>가입 이메일로 재설정 안내를 보내드립니다.</Text>
          {submitted ? (
            <Text accessibilityLiveRegion="polite" style={styles.message}>등록된 계정이면 비밀번호 재설정 안내를 받을 수 있습니다.</Text>
          ) : (
            <>
              <FormField placeholder="가입한 이메일" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <ActionButton title="재설정 이메일 보내기" onPress={handleReset} loading={loading} />
            </>
          )}
          <LinkButton title="로그인으로 돌아가기" onPress={() => navigation.navigate("Login")} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#121212" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  form: { width: "100%", maxWidth: 480, alignSelf: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#aaaaaa", textAlign: "center", marginBottom: 28 },
  error: { color: "#fca5a5", marginBottom: 8, textAlign: "center" },
  message: { color: "#bfdbfe", lineHeight: 22, marginBottom: 14, textAlign: "center" },
});
