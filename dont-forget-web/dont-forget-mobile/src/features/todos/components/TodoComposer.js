import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FormField } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { TODO_CATEGORIES, TODO_CATEGORY_EMOJIS } from "../store/todoStore";

export default function TodoComposer({ value, onChangeText, onSubmit, category, onCategoryChange, dueDate, dueTime, onDueTimeChange, reminders = [], onRemindersChange, onPickDate }) {
  const { colors } = useTheme(); const styles = makeStyles(colors);
  const [customAmount, setCustomAmount] = useState("15"); const [customUnit, setCustomUnit] = useState("minutes");
  const addReminder = () => { const multiplier = customUnit === "hours" ? 60 : customUnit === "days" ? 1440 : 1; const offset = Math.round(Number(customAmount) * multiplier); if (!Number.isInteger(offset) || offset < 1 || offset > 43200) return; onRemindersChange([...new Set([...reminders, offset])].sort((a, b) => b - a)); };
  const labelFor = (minutes) => minutes % 1440 === 0 ? `${minutes / 1440}일 전` : minutes % 60 === 0 ? `${minutes / 60}시간 전` : `${minutes}분 전`;
  return <View style={styles.container}>
    <Text style={styles.eyebrow}>QUICK ADD</Text><Text style={styles.title}>새로운 할 일</Text>
    <FormField placeholder="할 일을 입력하세요" value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} returnKeyType="done" maxLength={200} />
    <Text style={styles.label}>카테고리</Text>
    <View style={styles.chips}>{TODO_CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => onCategoryChange(item)} style={[styles.chip, category === item && styles.chipSelected]}><Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{TODO_CATEGORY_EMOJIS[item]} {item}</Text></TouchableOpacity>)}</View>
    <Text style={styles.label}>마감 날짜 · 시각</Text>
    <View style={styles.deadlineRow}><TouchableOpacity accessibilityRole="button" onPress={onPickDate} style={styles.dateButton}><Text style={styles.dateText}>📅  {dueDate}</Text></TouchableOpacity><TextInput accessibilityLabel="마감 시각" value={dueTime} onChangeText={onDueTimeChange} placeholder="23:59" keyboardType="numbers-and-punctuation" maxLength={5} style={styles.timeInput} placeholderTextColor={colors.muted} /></View>
    <Text style={styles.label}>마감 전 미리 알림</Text>
    <View style={styles.reminderRow}><TextInput value={customAmount} onChangeText={setCustomAmount} keyboardType="number-pad" style={styles.amountInput} placeholder="15" placeholderTextColor={colors.muted} /><View style={styles.unitToggle}>{[{ value: "minutes", label: "분" }, { value: "hours", label: "시간" }, { value: "days", label: "일" }].map((unit) => <TouchableOpacity key={unit.value} onPress={() => setCustomUnit(unit.value)} style={[styles.unitButton, customUnit === unit.value && styles.unitSelected]}><Text style={[styles.unitText, customUnit === unit.value && styles.unitTextSelected]}>{unit.label}</Text></TouchableOpacity>)}</View><TouchableOpacity onPress={addReminder} style={styles.reminderAdd}><Text style={styles.reminderAddText}>추가</Text></TouchableOpacity></View>
    <View style={styles.chips}>{reminders.map((minutes) => <TouchableOpacity key={minutes} onPress={() => onRemindersChange(reminders.filter((item) => item !== minutes))} style={styles.reminderChip}><Text style={styles.reminderChipText}>{labelFor(minutes)}  ×</Text></TouchableOpacity>)}</View>
    <TouchableOpacity accessibilityRole="button" style={styles.addButton} onPress={onSubmit}><Text style={styles.addButtonText}>＋  할 일 추가</Text></TouchableOpacity>
  </View>;
}
const makeStyles = (c) => StyleSheet.create({
  container: { backgroundColor: c.surface, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: 17, marginBottom: 18, shadowColor: c.shadow, shadowOpacity: 0.04, shadowRadius: 12, elevation: 1 },
  eyebrow: { color: c.primaryStrong, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, title: { color: c.text, fontSize: 19, fontWeight: "800", marginTop: 5, marginBottom: 13 },
  label: { color: c.muted, fontSize: 12, fontWeight: "700", marginBottom: 8 }, chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 7 },
  chip: { borderWidth: 1, borderColor: c.border, borderRadius: 18, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: c.input }, chipSelected: { backgroundColor: c.primary, borderColor: c.primary }, chipText: { color: c.muted, fontSize: 12 }, chipTextSelected: { color: "#fff", fontWeight: "700" },
  deadlineRow: { flexDirection: "row", gap: 8, marginBottom: 12 }, dateButton: { flex: 1, justifyContent: "center", padding: 12, borderWidth: 1, borderColor: c.border, borderRadius: 9, backgroundColor: c.input }, dateText: { color: c.text, fontWeight: "600" }, timeInput: { width: 88, borderWidth: 1, borderColor: c.border, borderRadius: 9, paddingHorizontal: 10, color: c.text, backgroundColor: c.input, textAlign: "center" },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 9 }, amountInput: { width: 52, padding: 8, borderWidth: 1, borderColor: c.border, borderRadius: 8, color: c.text, backgroundColor: c.input, textAlign: "center" }, unitToggle: { flexDirection: "row", borderWidth: 1, borderColor: c.border, borderRadius: 8, overflow: "hidden" }, unitButton: { paddingVertical: 8, paddingHorizontal: 9, backgroundColor: c.input }, unitSelected: { backgroundColor: c.primary }, unitText: { fontSize: 11, color: c.muted, fontWeight: "600" }, unitTextSelected: { color: "#fff" }, reminderAdd: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: c.primarySoft }, reminderAddText: { color: c.primaryStrong, fontWeight: "700", fontSize: 12 }, reminderChip: { borderRadius: 16, paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: c.border, backgroundColor: c.primarySoft }, reminderChipText: { color: c.primaryStrong, fontSize: 11, fontWeight: "600" },
  addButton: { backgroundColor: c.primary, padding: 14, borderRadius: 10, alignItems: "center" }, addButtonText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
