import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { requestIdLookup } from "../api/accountApi";

export default function FindIdScreen({ navigation }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!name.trim()) return setError("가입할 때 입력한 이름을 입력해 주세요.");
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await requestIdLookup(name);
      setMessage(result.message || "아이디 조회 결과를 확인할 수 없습니다.");
    } catch (requestError) {
      // The server intentionally disables name-only ID lookup to protect account privacy.
      setMessage(requestError?.response?.data?.message || "아이디 조회는 제공하지 않습니다. 가입한 이메일로 로그인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.title}>아이디 찾기</Text>
          <Text style={styles.subtitle}>이름만으로 이메일 주소를 확인할 수 없습니다.</Text>
          <FormField placeholder="가입한 이름" value={name} onChangeText={setName} autoCapitalize="words" />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
          <ActionButton title="조회 안내 확인" onPress={handleLookup} loading={loading} />
          <LinkButton title="로그인으로 돌아가기" onPress={() => navigation.navigate("Login")} />
          <LinkButton title="비밀번호 찾기" onPress={() => navigation.navigate("FindPassword")} />
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
  message: { color: "#bfdbfe", lineHeight: 22, marginBottom: 12, textAlign: "center" },
});
