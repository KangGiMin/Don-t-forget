import { FlatList, StyleSheet, Text } from "react-native";
import TodoListItem from "./TodoListItem";

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TodoListItem todo={item} onToggle={onToggleTodo} onDelete={onDeleteTodo} />
      )}
      ListEmptyComponent={<Text style={styles.empty}>등록된 할 일이 없습니다.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  empty: { color: "#888", textAlign: "center", padding: 20 },
});
