import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export function FormField({ style, ...props }) {
  const { colors } = useTheme();
  return <TextInput placeholderTextColor={colors.muted} selectionColor={colors.primary} style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }, style]} {...props} />;
}

export function ActionButton({ title, onPress, loading = false, disabled = false, secondary = false }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} disabled={disabled || loading} onPress={onPress} style={[styles.button, { backgroundColor: secondary ? colors.surfaceAlt : colors.primary, borderColor: colors.primary }, secondary && styles.secondary, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, secondary && { color: colors.primaryStrong }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function LinkButton({ title, onPress }) {
  const { colors } = useTheme();
  return <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.link}><Text style={[styles.linkText, { color: colors.primaryStrong }]}>{title}</Text></TouchableOpacity>;
}

export const palette = { background: "#f6f7f3", surface: "#ffffff", text: "#26352d", muted: "#78847c", primary: "#2f6b4f", danger: "#bd6259", border: "#dfe7df" };
const styles = StyleSheet.create({
  input: { paddingHorizontal: 15, paddingVertical: 14, borderRadius: 10, marginBottom: 12, fontSize: 15, borderWidth: 1 },
  button: { minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 6, borderWidth: 1 },
  secondary: { borderWidth: 1 },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  disabled: { opacity: 0.6 },
  link: { paddingVertical: 10, paddingHorizontal: 6, alignSelf: "center" },
  linkText: { fontSize: 14, fontWeight: "600" },
});
