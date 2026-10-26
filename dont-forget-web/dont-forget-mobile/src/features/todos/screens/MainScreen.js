import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField } from "../../../shared/components/FormControls";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { formatLocalDate, isValidLocalDate } from "../../../shared/utils/date";
import useTodoStore, { TODO_CATEGORIES, TODO_CATEGORY_EMOJIS } from "../store/todoStore";
import TodoComposer from "../components/TodoComposer";
import TodoListItem from "../components/TodoListItem";

const VIEW_FILTERS = ["오늘", "모든 할 일", "예정", "완료"];
const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const toDate = (value) => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d); };
const toIso = (date) => formatLocalDate(date);
const weekStart = (value) => { const date = toDate(value); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };

export default function MainScreen({ navigation }) {
  const { colors, themeMode, setThemeMode } = useTheme();
  const styles = makeStyles(colors);
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("근무");
  const [dueDate, setDueDate] = useState(formatLocalDate(new Date()));
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
    const added = await addTodo({ text: inputText, category, dueDate });
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
  const week = useMemo(() => { const start = weekStart(selectedDate); return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; }); }, [selectedDate]);
  const monthCells = useMemo(() => {
    const year = calendarMonth.getFullYear(); const month = calendarMonth.getMonth(); const first = new Date(year, month, 1); const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [calendarMonth]);

  const header = <View>
    <View style={styles.topBar}>
      <View style={styles.brandLine}><View style={styles.brandMark}><Text style={styles.brandCheck}>✓</Text></View><Text style={styles.brand}>don&apos;t forget</Text></View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="설정 열기" style={styles.avatar} onPress={() => setSettingsVisible(true)}><Text style={styles.avatarText}>{(auth.currentUser?.displayName || auth.currentUser?.email || "D").slice(0, 1).toUpperCase()}</Text></TouchableOpacity>
    </View>
    <View style={styles.greetingRow}><View><Text style={styles.eyebrow}>MY DAY</Text><Text style={styles.title}>{auth.currentUser?.displayName ? `${auth.currentUser.displayName}님, 안녕하세요` : "오늘도 차근차근"}</Text><Text style={styles.greeting}>오늘 할 일을 하나씩 완료해 보세요.</Text></View></View>
    <TouchableOpacity accessibilityRole="button" onPress={openCalendar} style={styles.progressCard}>
      <View style={styles.progressTop}><View style={{ flex: 1 }}><Text style={styles.progressDate}>{toDate(selectedDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}</Text><Text style={styles.progressCaption}>{dateTodos.length ? `${completedCount}개 완료 · ${dateTodos.length}개 중` : "오늘의 계획을 추가해 보세요"}</Text></View><Text style={styles.progressPercent}>{progress}<Text style={styles.progressPercentSign}>%</Text></Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
      <Text style={styles.calendarHint}>달력에서 날짜 선택  ›</Text>
    </TouchableOpacity>
    <View style={styles.weekStrip}>{week.map((date) => { const value = toIso(date); const active = value === selectedDate; return <TouchableOpacity key={value} onPress={() => selectDate(value)} style={[styles.dayCell, active && styles.dayCellActive]}><Text style={[styles.dayName, active && styles.dayTextActive]}>{WEEKDAYS[(date.getDay() + 6) % 7]}</Text><Text style={[styles.dayNumber, active && styles.dayTextActive]}>{date.getDate()}</Text><View style={[styles.dayDot, active && styles.dayDotActive]} /></TouchableOpacity>; })}</View>
    <View style={styles.viewTabs}>{VIEW_FILTERS.map((item) => <TouchableOpacity key={item} onPress={() => setViewFilter(item)} style={[styles.viewTab, viewFilter === item && styles.viewTabActive]}><Text style={[styles.viewTabText, viewFilter === item && styles.viewTabTextActive]}>{item === "예정" ? "예정" : item}</Text>{item === "완료" && todos.some((todo) => todo.completed) ? <View style={styles.tabDot} /> : null}</TouchableOpacity>)}</View>
    <TodoComposer value={inputText} onChangeText={setInputText} onSubmit={handleAdd} category={category} onCategoryChange={setCategory} dueDate={dueDate} onDueDateChange={setDueDate} />
    <Text style={styles.sectionLabel}>빠른 분류</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
      {["전체", ...TODO_CATEGORIES].map((item) => <TouchableOpacity key={item} onPress={() => setFilterCategory(item)} style={[styles.filter, filterCategory === item && styles.filterSelected]}><Text style={[styles.filterText, filterCategory === item && styles.filterTextSelected]}>{TODO_CATEGORY_EMOJIS[item] ? `${TODO_CATEGORY_EMOJIS[item]} ` : ""}{item}</Text></TouchableOpacity>)}
    </ScrollView>
    <FormField style={styles.search} placeholder="⌕  할 일 검색" value={searchTerm} onChangeText={setSearchTerm} returnKeyType="search" />
    {error || formError ? <Text accessibilityRole="alert" style={styles.error}>{error || formError}</Text> : null}
    <View style={styles.listHeading}><Text style={styles.listTitle}>{viewFilter === "오늘" ? "오늘의 할 일" : viewFilter}</Text><Text style={styles.listCount}>{filteredTodos.length}개</Text></View>
  </View>;

  return <SafeAreaView style={styles.safe}>
    <FlatList contentContainerStyle={styles.listContent} data={filteredTodos} keyExtractor={(item) => String(item._id)} ListHeaderComponent={header}
      ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} style={styles.empty} /> : <Text style={styles.empty}>{viewFilter === "오늘" ? "오늘은 아직 등록된 할 일이 없어요." : "조건에 맞는 할 일이 없습니다."}</Text>}
      refreshing={loading} onRefresh={fetchTodos} renderItem={({ item }) => <TodoListItem todo={item} onToggle={toggleTodo} onEdit={openEditor} onDelete={deleteTodo} />} keyboardShouldPersistTaps="handled" />

    <Modal visible={Boolean(editingTodo)} transparent animationType="fade" onRequestClose={() => setEditingTodo(null)}>
      <View style={styles.modalShade}><View style={styles.modal}><Text style={styles.modalTitle}>할 일 수정</Text><FormField placeholder="할 일" value={editText} onChangeText={setEditText} maxLength={200} />
        <Text style={styles.label}>카테고리</Text><View style={styles.editChips}>{TODO_CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setEditCategory(item)} style={[styles.filter, editCategory === item && styles.filterSelected]}><Text style={[styles.filterText, editCategory === item && styles.filterTextSelected]}>{TODO_CATEGORY_EMOJIS[item]} {item}</Text></TouchableOpacity>)}</View>
        <Text style={styles.label}>마감일 (YYYY-MM-DD)</Text><FormField placeholder="YYYY-MM-DD" value={editDueDate} onChangeText={setEditDueDate} maxLength={10} keyboardType="numbers-and-punctuation" />
        <ActionButton title="변경 저장" onPress={saveEdit} /><TouchableOpacity onPress={() => setEditingTodo(null)} style={styles.cancel}><Text style={styles.cancelText}>취소</Text></TouchableOpacity>
      </View></View>
    </Modal>

    <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
      <View style={styles.modalShade}><View style={styles.calendarModal}><View style={styles.sheetHandle} /><View style={styles.monthHeader}><TouchableOpacity onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><Text style={styles.monthArrow}>‹</Text></TouchableOpacity><Text style={styles.modalTitle}>{calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월</Text><TouchableOpacity onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><Text style={styles.monthArrow}>›</Text></TouchableOpacity></View>
        <View style={styles.calendarGrid}>{WEEKDAYS.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}{monthCells.map((date, index) => { const value = toIso(date); const active = value === selectedDate; const inMonth = date.getMonth() === calendarMonth.getMonth(); const hasTasks = todos.some((todo) => todo.dueDate === value); return <TouchableOpacity key={`${value}-${index}`} onPress={() => selectDate(value)} style={[styles.calendarDay, active && styles.calendarDayActive]}><Text style={[styles.calendarDayText, !inMonth && styles.outsideMonth, active && styles.dayTextActive]}>{date.getDate()}</Text>{hasTasks ? <View style={[styles.calendarTaskDot, active && styles.dayDotActive]} /> : <View style={styles.calendarNoDot} />}</TouchableOpacity>; })}</View>
        <ActionButton title="오늘로 이동" secondary onPress={() => selectDate(formatLocalDate(new Date()))} /><TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.cancel}><Text style={styles.cancelText}>닫기</Text></TouchableOpacity>
      </View></View>
    </Modal>

    <Modal visible={settingsVisible} transparent animationType="fade" onRequestClose={() => setSettingsVisible(false)}>
      <View style={styles.modalShade}><View style={styles.settingsModal}><View style={styles.settingsHeader}><Text style={styles.modalTitle}>메뉴 및 설정</Text><TouchableOpacity onPress={() => setSettingsVisible(false)}><Text style={styles.closeText}>✕</Text></TouchableOpacity></View>
        <TouchableOpacity style={styles.settingsLink} onPress={() => { setSettingsVisible(false); navigation.navigate("Profile"); }}><Text style={styles.settingsLinkText}>👤  내 프로필</Text><Text style={styles.chevron}>›</Text></TouchableOpacity>
        <TouchableOpacity style={styles.settingsLink} onPress={() => { setSettingsVisible(false); navigation.navigate("ContactAdmin"); }}><Text style={styles.settingsLinkText}>🎧  관리자에게 문의하기</Text><Text style={styles.chevron}>›</Text></TouchableOpacity>
        <Text style={styles.label}>화면 테마</Text><View style={styles.themeOptions}>{[{ value: "light", label: "☀️ 라이트" }, { value: "dark", label: "🌙 다크" }, { value: "system", label: "📱 시스템" }].map((option) => <TouchableOpacity key={option.value} onPress={() => setThemeMode(option.value)} style={[styles.themeOption, themeMode === option.value && styles.themeOptionActive]}><Text style={[styles.themeOptionText, themeMode === option.value && styles.themeOptionTextActive]}>{option.label}</Text></TouchableOpacity>)}</View>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}><Text style={styles.logoutText}>로그아웃</Text></TouchableOpacity>
      </View></View>
    </Modal>
  </SafeAreaView>;
}

const makeStyles = (c) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background }, listContent: { padding: 18, paddingBottom: 38 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, brandLine: { flexDirection: "row", alignItems: "center", gap: 8 }, brandMark: { width: 29, height: 29, borderRadius: 10, backgroundColor: c.primary, justifyContent: "center", alignItems: "center" }, brandCheck: { color: "#fff", fontSize: 19, fontWeight: "800" }, brand: { color: c.text, fontSize: 17, fontWeight: "800", letterSpacing: -0.5 },
  avatar: { width: 39, height: 39, borderRadius: 20, backgroundColor: c.primarySoft, borderWidth: 1, borderColor: c.border, justifyContent: "center", alignItems: "center" }, avatarText: { color: c.primaryStrong, fontSize: 15, fontWeight: "800" }, greetingRow: { marginBottom: 14 }, eyebrow: { color: c.primaryStrong, fontSize: 10, fontWeight: "800", letterSpacing: 1.3 }, title: { color: c.text, fontSize: 23, fontWeight: "800", marginTop: 4 }, greeting: { color: c.muted, fontSize: 13, marginTop: 4 },
  progressCard: { backgroundColor: c.primary, borderRadius: 18, padding: 17, marginBottom: 14, overflow: "hidden" }, progressTop: { flexDirection: "row", alignItems: "center" }, progressDate: { color: "#fff", fontSize: 15, fontWeight: "800" }, progressCaption: { color: "#e2f1e7", fontSize: 11, marginTop: 5 }, progressPercent: { color: "#fff", fontSize: 31, fontWeight: "800" }, progressPercentSign: { fontSize: 16 }, progressTrack: { height: 7, backgroundColor: "#ffffff4a", borderRadius: 8, marginTop: 14, overflow: "hidden" }, progressFill: { height: 7, backgroundColor: "#fff", borderRadius: 8 }, calendarHint: { color: "#e2f1e7", fontSize: 10, textAlign: "right", marginTop: 8 },
  weekStrip: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, marginBottom: 15 }, dayCell: { width: 39, minHeight: 61, borderRadius: 13, justifyContent: "center", alignItems: "center", backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }, dayCellActive: { backgroundColor: c.primary, borderColor: c.primary }, dayName: { fontSize: 10, color: c.muted, fontWeight: "600" }, dayNumber: { fontSize: 15, color: c.text, fontWeight: "800", marginTop: 3 }, dayTextActive: { color: "#fff", fontWeight: "800" }, dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "transparent", marginTop: 3 }, dayDotActive: { backgroundColor: "#fff" },
  viewTabs: { flexDirection: "row", gap: 7, padding: 4, backgroundColor: c.surfaceAlt, borderRadius: 12, marginBottom: 16 }, viewTab: { flex: 1, minHeight: 35, alignItems: "center", justifyContent: "center", borderRadius: 9, flexDirection: "row", gap: 3 }, viewTabActive: { backgroundColor: c.surface, shadowColor: c.shadow, shadowOpacity: 0.08, shadowRadius: 5, elevation: 1 }, viewTabText: { color: c.muted, fontSize: 11, fontWeight: "700" }, viewTabTextActive: { color: c.primaryStrong }, tabDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.primary },
  sectionLabel: { color: c.text, fontSize: 13, fontWeight: "800", marginBottom: 8 }, filters: { gap: 7, paddingBottom: 10 }, filter: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 18, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }, filterSelected: { borderColor: c.primary, backgroundColor: c.primary }, filterText: { color: c.muted, fontSize: 11 }, filterTextSelected: { color: "#fff", fontWeight: "700" }, search: { marginTop: 3, marginBottom: 8 }, error: { color: c.danger, marginBottom: 10, textAlign: "center" }, listHeading: { flexDirection: "row", alignItems: "center", marginBottom: 11, gap: 8 }, listTitle: { color: c.text, fontSize: 16, fontWeight: "800" }, listCount: { color: c.primaryStrong, backgroundColor: c.primarySoft, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontSize: 10, fontWeight: "800" }, empty: { color: c.muted, textAlign: "center", padding: 24, fontSize: 13 },
  modalShade: { flex: 1, backgroundColor: "#0008", justifyContent: "center", padding: 18 }, modal: { backgroundColor: c.surface, padding: 19, borderRadius: 18, borderWidth: 1, borderColor: c.border }, modalTitle: { color: c.text, fontSize: 19, fontWeight: "800", marginBottom: 16 }, label: { color: c.muted, marginBottom: 8, fontSize: 12, fontWeight: "700" }, editChips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 12 }, cancel: { alignItems: "center", padding: 13 }, cancelText: { color: c.muted, fontWeight: "600" },
  calendarModal: { backgroundColor: c.surface, padding: 19, paddingTop: 11, borderRadius: 22, borderWidth: 1, borderColor: c.border }, sheetHandle: { width: 36, height: 4, borderRadius: 3, backgroundColor: c.border, alignSelf: "center", marginBottom: 16 }, monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, monthArrow: { color: c.primaryStrong, fontSize: 29, paddingHorizontal: 9 }, calendarGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 7, marginBottom: 13 }, weekday: { width: "14.2857%", textAlign: "center", color: c.muted, fontSize: 11, fontWeight: "700", paddingVertical: 8 }, calendarDay: { width: "14.2857%", minHeight: 41, alignItems: "center", justifyContent: "center", borderRadius: 11 }, calendarDayActive: { backgroundColor: c.primary }, calendarDayText: { color: c.text, fontSize: 13, fontWeight: "600" }, outsideMonth: { color: c.border }, calendarTaskDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: c.primary, marginTop: 2 }, calendarNoDot: { height: 6 },
  settingsModal: { backgroundColor: c.surface, padding: 19, borderRadius: 18, borderWidth: 1, borderColor: c.border }, settingsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, closeText: { color: c.muted, fontSize: 17, padding: 5 }, settingsLink: { minHeight: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderColor: c.border }, settingsLinkText: { color: c.text, fontSize: 14, fontWeight: "600" }, chevron: { color: c.muted, fontSize: 22 }, themeOptions: { flexDirection: "row", gap: 7, marginBottom: 13 }, themeOption: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: c.input, borderRadius: 9, borderWidth: 1, borderColor: c.border }, themeOptionActive: { backgroundColor: c.primary, borderColor: c.primary }, themeOptionText: { color: c.muted, fontSize: 11, fontWeight: "700" }, themeOptionTextActive: { color: "#fff" }, logout: { backgroundColor: c.dangerSoft, borderRadius: 10, minHeight: 45, justifyContent: "center", alignItems: "center" }, logoutText: { color: c.danger, fontWeight: "800" },
});
