import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../shared/theme/ThemeContext";

export default function AuthLayout({ title, subtitle, children }) {
  const { colors } = useTheme();
  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.brandMark, { backgroundColor: colors.primarySoft }]}><Text style={[styles.check, { color: colors.primaryStrong }]}>✓</Text></View>
          <Text style={[styles.brand, { color: colors.primaryStrong }]}>don&apos;t forget</Text>
          <Text style={[styles.motto, { color: colors.muted }]}>오늘 할 일을 내일로 미루지 말자.</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 480, padding: 25, borderRadius: 20, borderWidth: 1, alignItems: "center", shadowOpacity: 0.08, shadowRadius: 22, shadowOffset: { width: 0, height: 9 }, elevation: 3 },
  brandMark: { width: 43, height: 43, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  check: { fontSize: 25, fontWeight: "800" },
  brand: { fontSize: 20, fontWeight: "800", letterSpacing: -0.6 },
  motto: { fontSize: 12, marginTop: 7, textAlign: "center" },
  divider: { width: 42, height: 1, marginTop: 21, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 7 },
  subtitle: { fontSize: 13, textAlign: "center", lineHeight: 20, marginBottom: 22 },
});
