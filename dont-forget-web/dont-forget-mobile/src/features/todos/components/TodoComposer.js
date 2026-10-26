import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormField } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { TODO_CATEGORIES, TODO_CATEGORY_EMOJIS } from "../store/todoStore";

export default function TodoComposer({ value, onChangeText, onSubmit, category, onCategoryChange, dueDate, onDueDateChange }) {
  const { colors } = useTheme(); const styles = makeStyles(colors);
  return <View style={styles.container}>
    <Text style={styles.eyebrow}>QUICK ADD</Text><Text style={styles.title}>새로운 할 일</Text>
    <FormField placeholder="할 일을 입력하세요" value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} returnKeyType="done" maxLength={200} />
    <Text style={styles.label}>카테고리</Text>
    <View style={styles.chips}>{TODO_CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => onCategoryChange(item)} style={[styles.chip, category === item && styles.chipSelected]}><Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{TODO_CATEGORY_EMOJIS[item]} {item}</Text></TouchableOpacity>)}</View>
    <Text style={styles.label}>마감일</Text>
    <FormField placeholder="YYYY-MM-DD" value={dueDate} onChangeText={onDueDateChange} keyboardType="numbers-and-punctuation" maxLength={10} />
    <TouchableOpacity accessibilityRole="button" style={styles.addButton} onPress={onSubmit}><Text style={styles.addButtonText}>＋  할 일 추가</Text></TouchableOpacity>
  </View>;
}
const makeStyles = (c) => StyleSheet.create({
  container: { backgroundColor: c.surface, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: 17, marginBottom: 18, shadowColor: c.shadow, shadowOpacity: 0.04, shadowRadius: 12, elevation: 1 },
  eyebrow: { color: c.primaryStrong, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, title: { color: c.text, fontSize: 19, fontWeight: "800", marginTop: 5, marginBottom: 13 },
  label: { color: c.muted, fontSize: 12, fontWeight: "700", marginBottom: 8 }, chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 7 },
  chip: { borderWidth: 1, borderColor: c.border, borderRadius: 18, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: c.input }, chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { color: c.muted, fontSize: 12 }, chipTextSelected: { color: "#fff", fontWeight: "700" }, addButton: { backgroundColor: c.primary, padding: 14, borderRadius: 10, alignItems: "center" }, addButtonText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
