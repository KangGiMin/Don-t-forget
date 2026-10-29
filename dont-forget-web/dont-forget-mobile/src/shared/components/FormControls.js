import { useReadableStyles } from "../layout/useMobileLayout";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export function FormField({ style, ...props }) {
  const styles = useReadableStyles(baseStyles);
  const { colors } = useTheme();
  return <TextInput placeholderTextColor={colors.muted} selectionColor={colors.primary} style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }, style]} {...props} />;
}

export function ActionButton({ title, onPress, loading = false, disabled = false, secondary = false, textStyle, style }) {
  const styles = useReadableStyles(baseStyles);
  const { colors } = useTheme();
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} disabled={disabled || loading} onPress={onPress} style={[styles.button, { backgroundColor: secondary ? colors.surfaceAlt : colors.primary, borderColor: colors.primary }, secondary && styles.secondary, (disabled || loading) && styles.disabled, style]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, secondary && { color: colors.primaryStrong }, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function EditActionButton({ title, onPress, style, textStyle, disabled = false }) {
  const styles = useReadableStyles(baseStyles);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionColorButton,
        styles.editActionButton,
        pressed && styles.editActionButtonPressed,
        disabled && styles.actionColorButtonDisabled,
        style,
      ]}
    >
      <Text style={[styles.actionColorButtonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function DeleteActionButton({ title, onPress, style, textStyle, disabled = false }) {
  const styles = useReadableStyles(baseStyles);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionColorButton,
        styles.deleteActionButton,
        pressed && styles.deleteActionButtonPressed,
        disabled && styles.actionColorButtonDisabled,
        style,
      ]}
    >
      <Text style={[styles.actionColorButtonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}
export function LinkButton({ title, onPress }) {
  const styles = useReadableStyles(baseStyles);
  const { colors } = useTheme();
  return <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.link}><Text style={[styles.linkText, { color: colors.primaryStrong }]}>{title}</Text></TouchableOpacity>;
}

export const palette = { background: "#f5f5f5", surface: "#ffffff", text: "#202124", muted: "#70757a", primary: "#2B6CB0", danger: "#bd6259", border: "#dadce0" };
const baseStyles = StyleSheet.create({
  input: { width: "100%", minHeight: 52, paddingHorizontal: 15, paddingVertical: 14, borderRadius: 10, marginBottom: 12, fontSize: 15, borderWidth: 1 },
  button: { minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 6, borderWidth: 1 },
  secondary: { borderWidth: 1 },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  actionColorButton: { minHeight: 44, alignSelf: "stretch", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
  editActionButton: { borderColor: "#16A34A", backgroundColor: "#16A34A" },
  editActionButtonPressed: { borderColor: "#15803D", backgroundColor: "#15803D" },
  deleteActionButton: { borderColor: "#DC2626", backgroundColor: "#DC2626" },
  deleteActionButtonPressed: { borderColor: "#B91C1C", backgroundColor: "#B91C1C" },
  actionColorButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  actionColorButtonDisabled: { opacity: 0.6 },
  disabled: { opacity: 0.6 },
  link: { minHeight: 44, justifyContent: "center", paddingVertical: 10, paddingHorizontal: 6, alignSelf: "center" },
  linkText: { fontSize: 14, fontWeight: "600" },
});
