import { FlatList, StyleSheet, Text } from "react-native";
import TodoListItem from "./TodoListItem";
import { useTheme } from "../../../shared/theme/ThemeContext";

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }) {
  const { colors } = useTheme();
  return <FlatList data={todos} keyExtractor={(item) => item._id} renderItem={({ item }) => <TodoListItem todo={item} onToggle={onToggleTodo} onDelete={onDeleteTodo} />} ListEmptyComponent={<Text style={[styles.empty, { color: colors.muted }]}>등록된 할 일이 없습니다.</Text>} />;
}
const styles = StyleSheet.create({ empty: { textAlign: "center", padding: 20 } });
