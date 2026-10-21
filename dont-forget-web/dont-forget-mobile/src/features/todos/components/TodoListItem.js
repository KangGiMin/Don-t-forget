import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TodoListItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <View style={styles.todoItem}>
      <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(todo.completed) }} onPress={() => onToggle(todo)} style={styles.todoTextContainer}>
        <Text style={[styles.todoText, todo.completed && styles.todoTextDone]}>{todo.completed ? "✅ " : "⬜ "}{todo.text}</Text>
        <Text style={styles.meta}>{todo.category || "기타"} · {todo.dueDate || "마감일 없음"}</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="할 일 수정" onPress={() => onEdit(todo)} style={styles.action}>
        <Text style={styles.edit}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="할 일 삭제" onPress={() => onDelete(todo._id)} style={styles.action}>
        <Text style={styles.delete}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  todoItem: { flexDirection: "row", backgroundColor: "#1e1e1e", padding: 14, borderRadius: 8, marginBottom: 10, alignItems: "center" },
  todoTextContainer: { flex: 1, paddingVertical: 3 },
  todoText: { color: "#fff", fontSize: 16, lineHeight: 22 },
  todoTextDone: { color: "#888", textDecorationLine: "line-through" },
  meta: { color: "#888", fontSize: 12, marginTop: 6 },
  action: { paddingVertical: 10, paddingHorizontal: 8 },
  edit: { color: "#93c5fd", fontSize: 13, fontWeight: "600" },
  delete: { color: "#fca5a5", fontSize: 13, fontWeight: "600" },
});
