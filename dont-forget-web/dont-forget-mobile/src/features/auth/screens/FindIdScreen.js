import { useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import AuthLayout from "../components/AuthLayout";
import { requestIdLookup } from "../api/accountApi";

export default function FindIdScreen({ navigation }) {
  const styles = useReadableStyles(baseStyles);
  const [name, setName] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const handleLookup = async () => {
    if (!name.trim()) return setError("가입할 때 입력한 이름을 입력해 주세요.");
    setError(""); setMessage(""); setLoading(true);
    try { const result = await requestIdLookup(name); setMessage(result.message || "아이디 조회 결과를 확인할 수 없습니다."); }
    catch (requestError) { setMessage(requestError?.response?.data?.message || "아이디 조회는 제공하지 않습니다. 가입한 이메일로 로그인해 주세요."); }
    finally { setLoading(false); }
  };
  return <AuthLayout title="아이디 찾기" subtitle="이름만으로 이메일 주소를 확인할 수 없습니다.">
    <View style={styles.form}>
      <FormField placeholder="가입한 이름" value={name} onChangeText={setName} autoCapitalize="words" />
      {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      {message ? <Text accessibilityLiveRegion="polite" style={[styles.message, { color: colors.primaryStrong }]}>{message}</Text> : null}
      <ActionButton title="조회 안내 확인" onPress={handleLookup} loading={loading} />
      <LinkButton title="로그인으로 돌아가기" onPress={() => navigation.navigate("Login")} />
      <LinkButton title="비밀번호 찾기" onPress={() => navigation.navigate("FindPassword")} />
    </View>
  </AuthLayout>;
}
const baseStyles = StyleSheet.create({ form: { width: "100%" }, error: { marginBottom: 8, textAlign: "center" }, message: { lineHeight: 22, marginBottom: 12, textAlign: "center" } });
