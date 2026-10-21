import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export function FormField({ style, ...props }) {
  return <TextInput placeholderTextColor="#858585" selectionColor="#60a5fa" style={[styles.input, style]} {...props} />;
}

export function ActionButton({ title, onPress, loading = false, disabled = false, secondary = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondary, (disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function LinkButton({ title, onPress }) {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.link}>
      <Text style={styles.linkText}>{title}</Text>
    </TouchableOpacity>
  );
}

export const palette = {
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  muted: "#aaaaaa",
  primary: "#3b82f6",
  danger: "#fca5a5",
  border: "#333333",
};

const styles = StyleSheet.create({
  input: { backgroundColor: "#1e1e1e", color: "#ffffff", paddingHorizontal: 15, paddingVertical: 14, borderRadius: 8, marginBottom: 14, fontSize: 16, borderWidth: 1, borderColor: "#333333" },
  button: { minHeight: 50, backgroundColor: "#3b82f6", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 6 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  secondary: { backgroundColor: "#252525", borderWidth: 1, borderColor: "#3b82f6" },
  secondaryText: { color: "#bfdbfe" },
  disabled: { opacity: 0.6 },
  link: { paddingVertical: 10, paddingHorizontal: 4, alignSelf: "center" },
  linkText: { color: "#93c5fd", fontSize: 14 },
});
