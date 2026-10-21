import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField } from "../../../shared/components/FormControls";
import { formatLocalDate, isValidLocalDate } from "../../../shared/utils/date";
import useTodoStore, { TODO_CATEGORIES } from "../store/todoStore";
import TodoComposer from "../components/TodoComposer";
import TodoListItem from "../components/TodoListItem";

export default function MainScreen({ navigation }) {
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("개인");
  const [dueDate, setDueDate] = useState(formatLocalDate(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [filterCategory, setFilterCategory] = useState("전체");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("개인");
  const [editDueDate, setEditDueDate] = useState("");
  const { todos, error, loading, addTodo, toggleTodo, updateTodo, deleteTodo, fetchTodos } = useTodoStore();

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    const matchesCategory = filterCategory === "전체" || todo.category === filterCategory;
    const matchesSearch = (todo.text || "").toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  }), [todos, filterCategory, searchTerm]);

  const handleAdd = async () => {
    if (!inputText.trim()) return setFormError("할 일을 입력해 주세요.");
    if (!isValidLocalDate(dueDate)) return setFormError("마감일을 올바른 YYYY-MM-DD 형식으로 입력해 주세요.");
    setFormError("");
    const added = await addTodo({ text: inputText, category, dueDate });
    if (added) {
      setInputText("");
      setSearchTerm("");
      setFilterCategory("전체");
    }
  };

  const openEditor = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text || "");
    setEditCategory(todo.category || "개인");
    setEditDueDate(todo.dueDate || formatLocalDate(new Date()));
  };

  const saveEdit = async () => {
    if (!editingTodo) return;
    if (!editText.trim()) return setFormError("할 일을 입력해 주세요.");
    if (!isValidLocalDate(editDueDate)) return setFormError("마감일을 올바른 YYYY-MM-DD 형식으로 입력해 주세요.");
    setFormError("");
    const saved = await updateTodo(editingTodo._id, { text: editText.trim(), category: editCategory, dueDate: editDueDate });
    if (saved) setEditingTodo(null);
  };

  const handleLogout = async () => { await signOut(auth); };

  const header = (
    <View>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>오늘의 할 일 📝</Text>
          <Text style={styles.greeting}>{auth.currentUser?.displayName || auth.currentUser?.email || "환영합니다"}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={handleLogout}><Text style={styles.headerAction}>로그아웃</Text></TouchableOpacity>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.navButton}><Text style={styles.navText}>내 프로필</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ContactAdmin")} style={styles.navButton}><Text style={styles.navText}>관리자 문의</Text></TouchableOpacity>
      </View>
      <TodoComposer value={inputText} onChangeText={setInputText} onSubmit={handleAdd} category={category} onCategoryChange={setCategory} dueDate={dueDate} onDueDateChange={setDueDate} />
      <FormField style={styles.search} placeholder="할 일 검색" value={searchTerm} onChangeText={setSearchTerm} returnKeyType="search" />
      <View style={styles.filters}>
        {["전체", ...TODO_CATEGORIES].map((item) => (
          <TouchableOpacity key={item} onPress={() => setFilterCategory(item)} style={[styles.filter, filterCategory === item && styles.filterSelected]}>
            <Text style={[styles.filterText, filterCategory === item && styles.filterTextSelected]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error || formError ? <Text accessibilityRole="alert" style={styles.error}>{error || formError}</Text> : null}
      <Text style={styles.listTitle}>할 일 목록 · {filteredTodos.length}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredTodos}
        keyExtractor={(item) => String(item._id)}
        ListHeaderComponent={header}
        ListEmptyComponent={loading
          ? <ActivityIndicator color="#3b82f6" style={styles.empty} />
          : <Text style={styles.empty}>조건에 맞는 할 일이 없습니다.</Text>}
        refreshing={loading}
        onRefresh={fetchTodos}
        renderItem={({ item }) => <TodoListItem todo={item} onToggle={toggleTodo} onEdit={openEditor} onDelete={deleteTodo} />}
        keyboardShouldPersistTaps="handled"
      />
      <Modal visible={Boolean(editingTodo)} transparent animationType="fade" onRequestClose={() => setEditingTodo(null)}>
        <View style={styles.modalShade}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>할 일 수정</Text>
            <FormField placeholder="할 일" value={editText} onChangeText={setEditText} maxLength={200} />
            <Text style={styles.label}>카테고리</Text>
            <View style={styles.filters}>
              {TODO_CATEGORIES.map((item) => (
                <TouchableOpacity key={item} onPress={() => setEditCategory(item)} style={[styles.filter, editCategory === item && styles.filterSelected]}>
                  <Text style={[styles.filterText, editCategory === item && styles.filterTextSelected]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>마감일 (YYYY-MM-DD)</Text>
            <FormField placeholder="YYYY-MM-DD" value={editDueDate} onChangeText={setEditDueDate} maxLength={10} keyboardType="numbers-and-punctuation" />
            <ActionButton title="변경 저장" onPress={saveEdit} />
            <TouchableOpacity onPress={() => setEditingTodo(null)} style={styles.cancel}><Text style={styles.cancelText}>취소</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },
  listContent: { padding: 18, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  heading: { flex: 1 },
  title: { fontSize: 25, fontWeight: "bold", color: "#fff" },
  greeting: { color: "#aaa", fontSize: 13, marginTop: 5 },
  headerAction: { color: "#93c5fd", fontSize: 14, padding: 8 },
  nav: { flexDirection: "row", marginBottom: 18, gap: 10 },
  navButton: { backgroundColor: "#202a39", borderRadius: 8, paddingVertical: 9, paddingHorizontal: 13 },
  navText: { color: "#bfdbfe", fontSize: 13, fontWeight: "600" },
  search: { marginBottom: 12 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 14 },
  filter: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 18, backgroundColor: "#202020", borderWidth: 1, borderColor: "#383838" },
  filterSelected: { borderColor: "#3b82f6", backgroundColor: "#1d4ed8" },
  filterText: { color: "#bbb", fontSize: 12 },
  filterTextSelected: { color: "#fff", fontWeight: "700" },
  error: { color: "#fca5a5", marginBottom: 12 },
  listTitle: { color: "#ddd", fontSize: 17, fontWeight: "700", marginBottom: 12 },
  empty: { color: "#888", textAlign: "center", padding: 24 },
  modalShade: { flex: 1, backgroundColor: "#000b", justifyContent: "center", padding: 20 },
  modal: { backgroundColor: "#151515", padding: 20, borderRadius: 14, borderWidth: 1, borderColor: "#353535" },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 18 },
  label: { color: "#ccc", marginBottom: 8 },
  cancel: { alignItems: "center", padding: 14 },
  cancelText: { color: "#bbb" },
});
