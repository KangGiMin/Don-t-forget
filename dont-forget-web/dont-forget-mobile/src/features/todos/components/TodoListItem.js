import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { TODO_CATEGORY_EMOJIS } from "../store/todoStore";

export default function TodoListItem({ todo, onToggle, onEdit, onDelete }) {
  const { colors } = useTheme(); const styles = makeStyles(colors);
  const category = todo.category === "업무" ? "근무" : todo.category === "개인" ? "기타" : todo.category || "기타";
  return <View style={styles.todoItem}>
    <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(todo.completed) }} onPress={() => onToggle(todo)} style={styles.todoTextContainer}>
      <Text style={[styles.todoText, todo.completed && styles.todoTextDone]}>{todo.completed ? "✓" : "○"}  {todo.text}</Text>
      <Text style={styles.meta}>{TODO_CATEGORY_EMOJIS[category] || "✨"} {category}  ·  {todo.dueDate || "마감일 없음"}</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="할 일 수정" onPress={() => onEdit(todo)} style={styles.action}><Text style={styles.edit}>수정</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="할 일 삭제" onPress={() => onDelete(todo._id)} style={styles.action}><Text style={styles.delete}>삭제</Text></TouchableOpacity>
  </View>;
}
const makeStyles = (c) => StyleSheet.create({
  todoItem: { flexDirection: "row", backgroundColor: c.surface, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: c.border, marginBottom: 9, alignItems: "center", shadowColor: c.shadow, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  todoTextContainer: { flex: 1, paddingVertical: 3 }, todoText: { color: c.text, fontSize: 14, lineHeight: 21, fontWeight: "600" }, todoTextDone: { color: c.muted, textDecorationLine: "line-through" }, meta: { color: c.muted, fontSize: 11, marginTop: 6 },
  action: { paddingVertical: 9, paddingHorizontal: 6 }, edit: { color: c.primaryStrong, fontSize: 12, fontWeight: "700" }, delete: { color: c.danger, fontSize: 12, fontWeight: "700" },
});
