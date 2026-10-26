import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { sendAdminMessage } from "../api/contactApi";
import { useTheme } from "../../../shared/theme/ThemeContext";

export default function ContactAdminScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return setError("제목과 내용을 모두 입력해 주세요.");
    if (title.trim().length > 160) return setError("제목은 160자 이내로 입력해 주세요.");
    if (content.trim().length > 5000) return setError("문의 내용은 5,000자 이내로 입력해 주세요.");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await sendAdminMessage({ userName: auth.currentUser?.displayName || "사용자", title: title.trim(), content: content.trim() });
      if (!response.data.success) throw new Error(response.data.message || "문의 접수에 실패했습니다.");
      setSuccess(response.data.message || "문의가 정상적으로 접수되었습니다!");
      setTitle("");
      setContent("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "서버와 통신할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.back} onPress={() => navigation.goBack()}>‹ 뒤로</Text>
          <Text style={styles.title}>관리자에게 문의하기</Text>
          <Text style={styles.subtitle}>문의 내용은 로그인한 계정의 이름과 함께 관리자에게 전달됩니다.</Text>
          <FormField placeholder="제목 (160자 이내)" value={title} onChangeText={setTitle} maxLength={160} />
          <FormField placeholder="문의 내용을 입력하세요 (5,000자 이내)" value={content} onChangeText={setContent} multiline numberOfLines={8} maxLength={5000} textAlignVertical="top" style={styles.messageInput} />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {success ? <Text accessibilityLiveRegion="polite" style={styles.success}>{success}</Text> : null}
          <ActionButton title="문의 보내기" onPress={handleSubmit} loading={loading} />
          <LinkButton title="메인으로 돌아가기" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const makeStyles = (c) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: c.background }, container: { flexGrow: 1, padding: 20, paddingTop: 48 }, form: { width: "100%", maxWidth: 520, alignSelf: "center", padding: 20, borderRadius: 18, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
  back: { color: c.primaryStrong, fontSize: 15, marginBottom: 18 }, title: { color: c.text, fontSize: 24, fontWeight: "bold", marginBottom: 8, textAlign: "center" }, subtitle: { color: c.muted, lineHeight: 20, marginBottom: 24, textAlign: "center" }, messageInput: { minHeight: 190 }, error: { color: c.danger, textAlign: "center", marginBottom: 8 }, success: { color: c.success, textAlign: "center", marginBottom: 8 },
});
