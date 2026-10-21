import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormField } from "../../../shared/components/FormControls";
import { TODO_CATEGORIES } from "../store/todoStore";

export default function TodoComposer({ value, onChangeText, onSubmit, category, onCategoryChange, dueDate, onDueDateChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>새로운 할 일</Text>
      <FormField placeholder="할 일을 입력하세요" value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} returnKeyType="done" maxLength={200} />
      <Text style={styles.label}>카테고리</Text>
      <View style={styles.chips}>
        {TODO_CATEGORIES.map((item) => (
          <TouchableOpacity key={item} onPress={() => onCategoryChange(item)} style={[styles.chip, category === item && styles.chipSelected]}>
            <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>마감일</Text>
      <FormField placeholder="YYYY-MM-DD" value={dueDate} onChangeText={onDueDateChange} keyboardType="numbers-and-punctuation" maxLength={10} />
      <TouchableOpacity accessibilityRole="button" style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>할 일 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#181818", borderRadius: 12, borderWidth: 1, borderColor: "#2a2a2a", padding: 15, marginBottom: 16 },
  label: { color: "#cfcfcf", fontSize: 13, fontWeight: "600", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 14, gap: 8 },
  chip: { borderWidth: 1, borderColor: "#444", borderRadius: 18, paddingVertical: 7, paddingHorizontal: 12 },
  chipSelected: { backgroundColor: "#1d4ed8", borderColor: "#3b82f6" },
  chipText: { color: "#bbb", fontSize: 13 },
  chipTextSelected: { color: "#fff", fontWeight: "700" },
  addButton: { backgroundColor: "#3b82f6", padding: 14, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
