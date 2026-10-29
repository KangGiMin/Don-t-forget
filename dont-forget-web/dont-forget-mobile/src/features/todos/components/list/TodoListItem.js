import { useReadableStyles } from "../../../../shared/layout/useMobileLayout";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../shared/theme/ThemeContext";
import { DeleteActionButton, EditActionButton } from "../../../../shared/components/FormControls";
import { TODO_CATEGORY_EMOJIS } from "../../store/todoStore";

function formatReminderOffset(value) {
  const minutes = Number(value?.offsetMinutes ?? value);
  if (!Number.isFinite(minutes) || minutes < 1) return null;
  if (minutes % 1440 === 0) return `${minutes / 1440}일 전`;
  if (minutes % 60 === 0) return `${minutes / 60}시간 전`;
  return `${minutes}분 전`;
}

export default function TodoListItem({ todo, onToggle, onEdit, onDelete }) {
  const { colors } = useTheme();
  const styles = useReadableStyles(makeStyles, colors);
  const category = todo.category === "업무" ? "근무" : todo.category === "개인" ? "기타" : todo.category || "기타";
  const reminderLabels = (Array.isArray(todo.reminders) ? todo.reminders : [])
    .map(formatReminderOffset)
    .filter(Boolean);

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(todo.completed) }} onPress={() => onToggle(todo)} style={styles.todoTextContainer}>
        <Text style={[styles.todoText, todo.completed && styles.todoTextDone]}>
          {todo.completed ? "✓" : "○"}  {todo.text}
        </Text>
        <Text style={styles.meta}>
          {TODO_CATEGORY_EMOJIS[category] || "✨"} {category}  ·  {todo.dueDate || "마감일 없음"}
        </Text>
        <Text style={styles.scheduleMeta}>◷ 마감 시각: {todo.dueTime || "23:59"}</Text>
        <Text style={styles.scheduleMeta}>
          🔔 미리 알림: {reminderLabels.length ? reminderLabels.join(", ") : "설정 없음"}
        </Text>
      </TouchableOpacity>
      <View style={styles.actionRow}><EditActionButton title="수정" onPress={() => onEdit(todo)} style={styles.action} />
      <DeleteActionButton title="삭제" onPress={() => onDelete(todo._id)} style={styles.action} /></View>
    </View>
  );
}

const makeStyles = (c) => StyleSheet.create({
  todoItem: { flexDirection: "column", backgroundColor: c.surface, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: c.border, marginBottom: 9, alignItems: "stretch", shadowColor: c.shadow, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  todoTextContainer: { minWidth: 0, paddingVertical: 3 },
  todoText: { color: c.text, fontSize: 14, lineHeight: 21, fontWeight: "600" },
  todoTextDone: { color: c.muted, textDecorationLine: "line-through" },
  meta: { color: c.muted, fontSize: 11, marginTop: 6 },
  scheduleMeta: { color: c.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  action: { paddingVertical: 9, paddingHorizontal: 6 },
  edit: { color: c.primaryStrong, fontSize: 12, fontWeight: "700" },
  delete: { color: c.danger, fontSize: 12, fontWeight: "700" },
});
