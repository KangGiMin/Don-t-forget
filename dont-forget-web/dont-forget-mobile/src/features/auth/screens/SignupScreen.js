import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { getAuthErrorMessage, registerAccount } from "../api/accountApi";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!email.trim() || !password || !name.trim()) return setError("이메일, 비밀번호, 이름을 모두 입력해 주세요.");
    if (password.length < 10) return setError("비밀번호는 10자 이상이어야 합니다.");
    if (name.trim().length > 60) return setError("이름은 60자 이내로 입력해 주세요.");
    setLoading(true);
    setError("");
    try {
      await registerAccount({ email, password, name });
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>새 계정을 만들어 시작해 보세요.</Text>
          <FormField placeholder="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
          <FormField placeholder="비밀번호 (10자 이상)" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" />
          <FormField placeholder="이름 또는 닉네임" value={name} onChangeText={setName} maxLength={60} autoComplete="name" returnKeyType="done" onSubmitEditing={handleSignup} />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <ActionButton title="가입하기" onPress={handleSignup} loading={loading} />
          <LinkButton title="이미 계정이 있어요 · 로그인" onPress={() => navigation.navigate("Login")} />
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
});
