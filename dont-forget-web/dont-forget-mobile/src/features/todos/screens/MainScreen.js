import { SafeAreaView } from "react-native-safe-area-context";
import { useMobileLayout, useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { formatLocalDate, isValidLocalDate } from "../../../shared/utils/date";
import { toDate, weekStart, WEEKDAYS } from "../utils/calendar";
import useTodoStore from "../store/todoStore";
import TodoListItem from "../components/list/TodoListItem";
import { registerExpoPushNotifications } from "../../../services/notifications/pushNotifications";
import { createMainScreenStyles as makeStyles } from "../styles";
import TodoEditorModal from "../components/modals/TodoEditorModal";
import MainDashboardHeader from "../components/dashboard/MainDashboardHeader";
import CalendarPickerModal from "../components/modals/CalendarPickerModal";
import MainSettingsModal from "../components/modals/MainSettingsModal";


export default function MainScreen({ navigation }) {
  const { colors, themeMode, setThemeMode } = useTheme();
  const layout = useMobileLayout();
  const styles = useReadableStyles(makeStyles, colors);
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("근무");
  const [dueDate, setDueDate] = useState(formatLocalDate(new Date()));
  const [dueTime, setDueTime] = useState("23:59");
  const [reminders, setReminders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [filterCategory, setFilterCategory] = useState("전체");
  const [viewFilter, setViewFilter] = useState("오늘");
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("근무");
  const [editDueDate, setEditDueDate] = useState("");
  const { todos, error, loading, addTodo, toggleTodo, updateTodo, deleteTodo, fetchTodos } = useTodoStore();
  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const dateTodos = useMemo(() => todos.filter((todo) => (todo.dueDate || "") === selectedDate), [todos, selectedDate]);
  const completedCount = dateTodos.filter((todo) => todo.completed).length;
  const progress = dateTodos.length ? Math.round((completedCount / dateTodos.length) * 100) : 0;
  const filteredTodos = useMemo(() => todos.filter((todo) => {
    const legacyCategoryAliases = { 근무: ["업무"], 기타: ["개인"] };
    const matchesCategory = filterCategory === "전체" || todo.category === filterCategory || legacyCategoryAliases[filterCategory]?.includes(todo.category);
    const matchesSearch = (todo.text || "").toLowerCase().includes(searchTerm.trim().toLowerCase());
    const date = todo.dueDate || "";
    const matchesView = viewFilter === "오늘" ? date === selectedDate
      : viewFilter === "예정" ? date > formatLocalDate(new Date()) && !todo.completed
        : viewFilter === "완료" ? Boolean(todo.completed) : true;
    return matchesCategory && matchesSearch && matchesView;
  }), [todos, filterCategory, searchTerm, viewFilter, selectedDate]);

  const handleAdd = async () => {
    if (!inputText.trim()) return setFormError("할 일을 입력해 주세요.");
    if (!isValidLocalDate(dueDate)) return setFormError("마감일을 올바른 YYYY-MM-DD 형식으로 입력해 주세요.");
    setFormError("");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
    const dueAt = new Date(`${dueDate}T${dueTime}:00`).toISOString();
    const added = await addTodo({ text: inputText, category, dueDate, dueTime, dueAt, timeZone, reminders });
    if (added) { setInputText(""); setSearchTerm(""); setFilterCategory("전체"); setViewFilter(dueDate === selectedDate ? "오늘" : "모든 할 일"); }
  };
  const openEditor = (todo) => { setEditingTodo(todo); setEditText(todo.text || ""); setEditCategory(todo.category === "업무" ? "근무" : todo.category === "개인" ? "기타" : todo.category || "근무"); setEditDueDate(todo.dueDate || formatLocalDate(new Date())); };
  const saveEdit = async () => {
    if (!editingTodo) return;
    if (!editText.trim()) return setFormError("할 일을 입력해 주세요.");
    if (!isValidLocalDate(editDueDate)) return setFormError("마감일을 올바른 YYYY-MM-DD 형식으로 입력해 주세요.");
    setFormError("");
    const saved = await updateTodo(editingTodo._id, { text: editText.trim(), category: editCategory, dueDate: editDueDate });
    if (saved) setEditingTodo(null);
  };
  const openCalendar = () => { setCalendarMonth(toDate(selectedDate)); setCalendarVisible(true); };
  const selectDate = (value) => { setSelectedDate(value); setDueDate(value); setViewFilter("오늘"); setCalendarVisible(false); };
  const handleLogout = async () => { setSettingsVisible(false); await signOut(auth); };
  const handleEnablePush = async () => { const result = await registerExpoPushNotifications(); Alert.alert(result.success ? "알림 설정" : "알림 등록 안내", result.message); };
  const week = useMemo(() => { const start = weekStart(selectedDate); return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; }); }, [selectedDate]);
  const monthCells = useMemo(() => {
    const year = calendarMonth.getFullYear(); const month = calendarMonth.getMonth(); const first = new Date(year, month, 1); const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [calendarMonth]);

  const header = (
    <MainDashboardHeader
      styles={styles}
      displayName={auth.currentUser?.displayName}
      avatarLabel={auth.currentUser?.displayName || auth.currentUser?.email || "D"}
      onOpenSettings={() => setSettingsVisible(true)}
      inputText={inputText}
      onInputTextChange={setInputText}
      onAddTodo={handleAdd}
      category={category}
      onCategoryChange={setCategory}
      dueDate={dueDate}
      dueTime={dueTime}
      onDueTimeChange={setDueTime}
      reminders={reminders}
      onRemindersChange={setReminders}
      onOpenCalendar={openCalendar}
      selectedDate={selectedDate}
      dateTodos={dateTodos}
      completedCount={completedCount}
      progress={progress}
      week={week}
      onSelectDate={selectDate}
      viewFilter={viewFilter}
      onViewFilterChange={setViewFilter}
      todos={todos}
      filterCategory={filterCategory}
      onFilterCategoryChange={setFilterCategory}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      error={error}
      formError={formError}
      filteredTodoCount={filteredTodos.length}
    />
  );
  return <SafeAreaView style={styles.safe}>
    <FlatList style={{ flex: 1 }} contentContainerStyle={[styles.listContent, { flexGrow: 1, width: "100%", maxWidth: 840, alignSelf: "center", paddingHorizontal: layout.gutter }]} data={filteredTodos} keyExtractor={(item) => String(item._id)} ListHeaderComponent={header}
      ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} style={styles.empty} /> : <Text style={styles.empty}>{viewFilter === "오늘" ? "오늘은 아직 등록된 할 일이 없어요." : "조건에 맞는 할 일이 없습니다."}</Text>}
      refreshing={loading} onRefresh={fetchTodos} renderItem={({ item }) => <TodoListItem todo={item} onToggle={toggleTodo} onEdit={openEditor} onDelete={deleteTodo} />} keyboardShouldPersistTaps="handled" />

    <TodoEditorModal
      visible={Boolean(editingTodo)}
      styles={styles}
      editText={editText}
      onEditTextChange={setEditText}
      editCategory={editCategory}
      onEditCategoryChange={setEditCategory}
      editDueDate={editDueDate}
      onEditDueDateChange={setEditDueDate}
      onSave={saveEdit}
      onClose={() => setEditingTodo(null)}
    />
    <CalendarPickerModal
      visible={calendarVisible}
      styles={styles}
      month={calendarMonth}
      monthCells={monthCells}
      weekdays={WEEKDAYS}
      todos={todos}
      selectedDate={selectedDate}
      onSelectDate={selectDate}
      onPreviousMonth={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
      onNextMonth={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
      onToday={() => selectDate(formatLocalDate(new Date()))}
      onClose={() => setCalendarVisible(false)}
    />
    <MainSettingsModal
      visible={settingsVisible}
      styles={styles}
      themeMode={themeMode}
      onThemeChange={setThemeMode}
      onNavigate={(route) => { setSettingsVisible(false); navigation.navigate(route); }}
      onEnablePush={handleEnablePush}
      onLogout={handleLogout}
      onClose={() => setSettingsVisible(false)}
    />
  </SafeAreaView>;
}
