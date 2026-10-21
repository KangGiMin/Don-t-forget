import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { getAuthErrorMessage } from "../api/accountApi";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
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
          <Text style={styles.title}>Don&apos;t Forget</Text>
          <Text style={styles.subtitle}>다시 온 걸 환영해! 👋</Text>
          <FormField placeholder="이메일을 입력하세요" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
          <FormField placeholder="비밀번호를 입력하세요" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={handleLogin} returnKeyType="go" />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <ActionButton title="로그인" onPress={handleLogin} loading={loading} />
          <View style={styles.links}>
            <LinkButton title="회원가입" onPress={() => navigation.navigate("Signup")} />
            <LinkButton title="아이디 찾기" onPress={() => navigation.navigate("FindId")} />
            <LinkButton title="비밀번호 찾기" onPress={() => navigation.navigate("FindPassword")} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#121212" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  form: { width: "100%", maxWidth: 480, alignSelf: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaaaaa", textAlign: "center", marginBottom: 36 },
  error: { color: "#fca5a5", marginBottom: 8, textAlign: "center" },
  links: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginTop: 8 },
});
