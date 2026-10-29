import { useMobileLayout, useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActionButton,
  DeleteActionButton,
  EditActionButton,
  FormField,
} from "../../../shared/components/FormControls";
import { apiDelete, apiGet, apiPut, getApiErrorMessage } from "../../../services/api/client";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { formatLocalDate } from "../../../shared/utils/date";
import useTodoStore, {
  TODO_CATEGORY_EMOJIS,
} from "../../todos/store/todoStore";

const makeCalendarDates = (month) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  return Array.from(
    { length: 42 },
    (_, index) => new Date(year, monthIndex, index - mondayOffset + 1),
  );
};

const eventDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : formatLocalDate(parsed);
};

const formatReminderOffset = (value) => {
  const minutes = Number(value?.offsetMinutes ?? value);
  if (!Number.isFinite(minutes) || minutes < 1) return null;
  if (minutes % 1440 === 0) return `${minutes / 1440}일 전`;
  if (minutes % 60 === 0) return `${minutes / 60}시간 전`;
  return `${minutes}분 전`;
};
export default function JournalScreen({ navigation }) {
  const { colors } = useTheme();
  const layout = useMobileLayout();
  const s = useReadableStyles(styles, colors);
  const today = formatLocalDate(new Date());
  const [date, setDate] = useState(today);
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [journalDates, setJournalDates] = useState([]);
  const [modalProgress] = useState(() => new Animated.Value(0));
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  const calendarDates = useMemo(
    () => makeCalendarDates(viewMonth),
    [viewMonth],
  );
  const selectedTodos = useMemo(
    () =>
      todos.filter(
        (todo) =>
          todo.dueDate === date ||
          eventDate(todo.createdAt) === date ||
          eventDate(todo.completedAt) === date,
      ),
    [date, todos],
  );
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
  const monthLabel = `${viewMonth.getFullYear()}년 ${viewMonth.getMonth() + 1}월`;
  const selectedDateLabel = `${date.slice(0, 4)}년 ${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일`;

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    let active = true;
    apiGet(`/journals?from=${date}&to=${date}`)
      .then((response) => {
        if (!active) return;
        const journal = response.data.journals?.[0];
        setTitle(journal?.title || "");
        setContent(journal?.content || "");
        setSaved(Boolean(journal));
        setMessage("");
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [date]);

  useEffect(() => {
    let active = true;
    const year = viewMonth.getFullYear();
    const month = String(viewMonth.getMonth() + 1).padStart(2, "0");
    const from = `${year}-${month}-01`;
    const to = formatLocalDate(new Date(year, viewMonth.getMonth() + 1, 0));
    apiGet(`/journals?from=${from}&to=${to}`)
      .then((response) => {
        if (active)
          setJournalDates(
            (response.data.journals || []).map((journal) => journal.date),
          );
      })
      .catch(() => {
        if (active) setJournalDates([]);
      });
    return () => {
      active = false;
    };
  }, [viewMonth]);

  useEffect(() => {
    if (!editorOpen) {
      modalProgress.setValue(0);
      return undefined;
    }
    modalProgress.setValue(0);
    const animation = Animated.spring(modalProgress, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 5,
    });
    animation.start();
    return () => animation.stop();
  }, [editorOpen, modalProgress]);

  const save = async () => {
    try {
    const response = await apiPut("/journals", { date, title, content });
    if (response.data.success) {
      setSaved(true);
      setJournalDates((current) => [...new Set([...current, date])]);
      setMessage("일기를 저장했습니다.");
      setIsEditing(false);
    } else {
      setMessage(response.data.message || "저장하지 못했습니다.");
    }
    } catch (error) { setMessage(getApiErrorMessage(error)); }
  };

  const remove = async () => {
    try {
    const response = await apiDelete(`/journals/${date}`);
    if (response.data.success) {
      setTitle("");
      setContent("");
      setSaved(false);
      setJournalDates((current) => current.filter((item) => item !== date));
      setMessage("");
      setEditorOpen(false);
      setIsEditing(false);
    }
    } catch (error) { setMessage(getApiErrorMessage(error)); }
  };

  const openJournal = () => {
    if (editorOpen) {
      setEditorOpen(false);
      setIsEditing(false);
      return;
    }
    setEditorOpen(true);
    setIsEditing(!saved);
  };

  const selectDate = (dateKey) => {
    setDate(dateKey);
    setSaved(journalDates.includes(dateKey));
    setEditorOpen(false);
    setIsEditing(false);
    setMessage("");
  };

  const shiftMonth = (amount) => {
    setViewMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  };

  return (
    <View style={s.safe}>
      <ScrollView
        contentContainerStyle={[s.container, layout.pageContent, { paddingBottom: layout.insets.bottom + 112 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>‹ 메인으로</Text>
        </TouchableOpacity>
        <Text style={s.eyebrow}>REFLECT & REMEMBER</Text>
        <Text style={s.title}>오늘의 일기</Text>

        <View style={s.calendarCard}>
          <View style={s.monthHeader}>
            <TouchableOpacity
              onPress={() => shiftMonth(-1)}
              style={s.monthButton}
            >
              <Text style={s.monthArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={s.monthTitle}>{monthLabel}</Text>
            <TouchableOpacity
              onPress={() => shiftMonth(1)}
              style={s.monthButton}
            >
              <Text style={s.monthArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDate(today);
                setViewMonth(new Date());
              }}
              style={s.todayButton}
            >
              <Text style={s.todayText}>오늘</Text>
            </TouchableOpacity>
          </View>

          <View style={s.calendarGrid}>
            {weekdays.map((weekday, index) => (
              <Text
                key={weekday}
                style={[
                  s.weekday,
                  index === 5 && s.saturday,
                  index === 6 && s.sunday,
                ]}
              >
                {weekday}
              </Text>
            ))}
            {calendarDates.map((calendarDate) => {
              const dateKey = formatLocalDate(calendarDate);
              const isOutside =
                calendarDate.getMonth() !== viewMonth.getMonth();
              const hasTodos = todos.some(
                (todo) =>
                  todo.dueDate === dateKey ||
                  eventDate(todo.createdAt) === dateKey ||
                  eventDate(todo.completedAt) === dateKey,
              );
              const hasJournal = journalDates.includes(dateKey);
              const isSelected = dateKey === date;
              const isToday = dateKey === today;
              return (
                <TouchableOpacity
                  key={dateKey}
                  onPress={() => selectDate(dateKey)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    s.dayCell,
                    isOutside && s.outsideDay,
                    isToday && !isSelected && s.todayCell,
                    isSelected && s.selectedDay,
                  ]}
                >
                  <Text style={[s.dayNumber, isSelected && s.selectedDayText]}>
                    {calendarDate.getDate()}
                  </Text>
                  <View style={s.dayDots}>
                    {hasTodos ? (
                      <View style={[s.todoDot, isSelected && s.selectedDot]} />
                    ) : null}
                    {hasJournal ? (
                      <View
                        style={[s.journalDot, isSelected && s.selectedDot]}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={s.legend}>
            <Text style={s.legendItem}>
              <Text style={s.legendTodoDot}>●</Text> 할 일
            </Text>
            <Text style={s.legendItem}>
              <Text style={s.legendJournalDot}>●</Text> 일기 작성
            </Text>
          </View>
        </View>

        <View style={s.dayPanel}>
          <View style={s.dayHeading}>
            <View>
              <Text style={s.dayEyebrow}>이날의 할 일</Text>
              <Text style={s.dayTitle}>{selectedDateLabel}</Text>
            </View>
            <Text style={s.count}>{selectedTodos.length}</Text>
          </View>
          {selectedTodos.length ? (
            selectedTodos.map((todo) => {
              const completed = Boolean(todo.completed);
              const reminderLabels = (
                Array.isArray(todo.reminders) ? todo.reminders : []
              )
                .map(formatReminderOffset)
                .filter(Boolean);
              const details = [
                todo.dueDate === date
                  ? `마감 시각 ${todo.dueTime || "23:59"}`
                  : null,
                `미리 알림 ${reminderLabels.length ? reminderLabels.join(", ") : "설정 없음"}`,
                completed ? "완료" : "진행 중",
              ].filter(Boolean);
              const category =
                todo.category === "업무"
                  ? "근무"
                  : todo.category === "개인"
                    ? "기타"
                    : todo.category || "기타";
              return (
                <View key={todo._id} style={s.todoRow}>
                  <Text style={[s.todoCheck, completed && s.todoCheckDone]}>
                    {completed ? "✓" : "○"}
                  </Text>
                  <View style={s.todoDetails}>
                    <Text style={s.todoText}>{todo.text}</Text>
                    <Text style={s.todoMeta}>
                      {TODO_CATEGORY_EMOJIS[category] || "✨"} {category}
                    </Text>
                    <Text style={s.todoScheduleMeta}>
                      {details.join(" · ")}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={s.empty}>이날 등록·마감·완료한 할 일이 없습니다.</Text>
          )}
        </View>

      </ScrollView>

      <TouchableOpacity
        style={[s.fab, { bottom: layout.insets.bottom + 18, right: layout.gutter }]}
        onPress={openJournal}
        accessibilityRole="button"
        accessibilityState={{ expanded: editorOpen }}
      >
        <Text style={s.fabText}>
          {editorOpen ? "×  닫기" : saved ? "◉  일기 보기" : "＋  일기 쓰기"}
        </Text>
      </TouchableOpacity>

      <Modal visible={editorOpen} transparent animationType="fade" statusBarTranslucent
        onRequestClose={() => { setEditorOpen(false); setIsEditing(false); }}>
        <View style={[s.modalBackdrop, { paddingTop: layout.insets.top + 12, paddingBottom: layout.insets.bottom + 12 }]}>
          <Pressable style={StyleSheet.absoluteFill}
            onPress={() => { setEditorOpen(false); setIsEditing(false); }}
            accessibilityRole="button" accessibilityLabel="일기 닫기" />
          <KeyboardAvoidingView style={s.modalKeyboardAvoid}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Animated.View style={[s.notebookCard, {
              opacity: modalProgress,
              transform: [{ scale: modalProgress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
            }]}>
              <ScrollView contentContainerStyle={s.notebookContent}
                keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {saved && !isEditing ? (
                  <>
                    <View style={s.notebookDateRow}>
                      <Text style={s.notebookDate}>📅 {selectedDateLabel}</Text>
                      <TouchableOpacity onPress={() => { setEditorOpen(false); setIsEditing(false); }} style={s.closeButton}>
                        <Text style={s.closeText}>×</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={s.notebookViewTitle}>{title || "제목 없는 일기"}</Text>
                    <View style={s.notebookPaper}>
                      <View style={s.notebookGuideLayer} pointerEvents="none">
                        {Array.from({ length: 12 }, (_, index) => <View key={index} style={[s.notebookRule, { top: (index + 1) * 27 }]} />)}
                        
                      </View>
                      <Text style={s.notebookReadContent}>{content}</Text>
                    </View>
                    <View style={s.notebookActions}>
                      <EditActionButton title="✏️ 수정하기" onPress={() => setIsEditing(true)} style={s.notebookEditAction} textStyle={s.notebookEditActionText} />
                      <TouchableOpacity onPress={() => { setEditorOpen(false); setIsEditing(false); }} style={s.notebookCloseAction}>
                        <Text style={s.notebookCloseActionText}>닫기</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={s.notebookDateRow}>
                      <Text style={s.notebookDate}>📅 {selectedDateLabel}</Text>
                      <TouchableOpacity onPress={() => { setEditorOpen(false); setIsEditing(false); }} style={s.closeButton}>
                        <Text style={s.closeText}>×</Text>
                      </TouchableOpacity>
                    </View>
                    <FormField value={title} onChangeText={setTitle} maxLength={120}
                      placeholder="오늘을 한 문장으로" style={s.notebookTitleInput} />
                    <View style={s.notebookPaper}>
                      <View style={s.notebookGuideLayer} pointerEvents="none">
                        {Array.from({ length: 12 }, (_, index) => <View key={index} style={[s.notebookRule, { top: (index + 1) * 27 }]} />)}
                        
                      </View>
                      <FormField value={content} onChangeText={setContent} multiline
                        textAlignVertical="top" maxLength={20000}
                        placeholder="오늘 하루를 이야기로 기록해 보세요." style={s.notebookBodyInput} />
                    </View>
                    {message ? <Text style={s.message}>{message}</Text> : null}
                    <View style={s.notebookActions}>
                      <ActionButton title={saved ? "저장하기" : "일기 저장"} onPress={save} style={s.notebookSaveAction} textStyle={s.notebookSaveActionText} />
                      {saved ? <DeleteActionButton title="일기 삭제" onPress={remove} /> : null}
                      <TouchableOpacity onPress={() => { setEditorOpen(false); setIsEditing(false); }} style={s.notebookCloseAction}>
                        <Text style={s.notebookCloseActionText}>닫기</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = (c) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    container: { padding: 16, paddingTop: 22, paddingBottom: 112 },
    back: { color: c.primaryStrong, fontSize: 14, marginBottom: 16 },
    eyebrow: {
      color: c.primaryStrong,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },
    title: {
      color: c.text,
      fontSize: 24,
      fontWeight: "800",
      marginTop: 4,
      marginBottom: 28,
    },
    calendarCard: {
      backgroundColor: c.surface,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 18,
      padding: 12,
      marginBottom: 12,
    },
    monthHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 12,
    },
    monthButton: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
    },
    monthArrow: { color: c.text, fontSize: 20 },
    monthTitle: {
      color: c.text,
      fontSize: 17,
      fontWeight: "800",
      minWidth: 112,
      textAlign: "center",
    },
    todayButton: {
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 9,
      backgroundColor: c.primarySoft,
    },
    todayText: { color: c.primaryStrong, fontSize: 11, fontWeight: "800" },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    weekday: {
      width: "13.5%",
      textAlign: "center",
      color: c.muted,
      fontSize: 11,
      fontWeight: "800",
      paddingVertical: 7,
    },
    saturday: { color: c.primaryStrong },
    sunday: { color: "#D56A6A" },
    dayCell: {
      width: "13.5%",
      height: 47,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 9,
      marginBottom: 4,
      backgroundColor: c.background,
    },
    outsideDay: { opacity: 0.4 },
    todayCell: { borderColor: c.primary },
    selectedDay: { backgroundColor: c.primary, borderColor: c.primary },
    dayNumber: { color: c.text, fontSize: 12, fontWeight: "700" },
    selectedDayText: { color: "#fff" },
    dayDots: { height: 5, flexDirection: "row", gap: 3, marginTop: 3 },
    todoDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.primary,
    },
    journalDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: "#E3A43B",
    },
    selectedDot: { backgroundColor: "#fff" },
    legend: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 9,
    },
    legendItem: { color: c.muted, fontSize: 10 },
    legendTodoDot: { color: c.primary },
    legendJournalDot: { color: "#E3A43B" },
    dayPanel: {
      backgroundColor: c.surface,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 15,
      padding: 14,
      marginBottom: 12,
    },
    dayHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    dayEyebrow: {
      color: c.primaryStrong,
      fontSize: 10,
      fontWeight: "800",
      marginBottom: 4,
    },
    dayTitle: { color: c.text, fontSize: 15, fontWeight: "800" },
    count: {
      color: c.primaryStrong,
      backgroundColor: c.primarySoft,
      overflow: "hidden",
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 11,
      fontWeight: "800",
    },
    todoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 11,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    todoCheck: {
      width: 25,
      height: 25,
      lineHeight: 24,
      textAlign: "center",
      color: c.primaryStrong,
      backgroundColor: c.primarySoft,
      borderRadius: 13,
      fontWeight: "800",
    },
    todoCheckDone: { color: c.success },
    todoDetails: { flex: 1, alignItems: "flex-start" },
    todoText: {
      width: "100%",
      color: c.text,
      fontSize: 13,
      fontWeight: "700",
      textAlign: "left",
    },
    todoMeta: {
      width: "100%",
      color: c.muted,
      fontSize: 10,
      marginTop: 4,
      textAlign: "left",
    },
    todoScheduleMeta: {
      width: "100%",
      color: c.muted,
      fontSize: 10,
      lineHeight: 15,
      marginTop: 3,
      textAlign: "left",
    },
    empty: {
      color: c.muted,
      textAlign: "center",
      fontSize: 12,
      paddingVertical: 20,
    },
    editorCard: {
      backgroundColor: c.surface,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 15,
      padding: 15,
      gap: 8,
    },
    modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 14, backgroundColor: "rgba(7, 12, 20, 0.72)" },
    modalKeyboardAvoid: { flex: 1, width: "100%", justifyContent: "center" },
    notebookCard: { width: "100%", maxHeight: "95%", maxWidth: 840, alignSelf: "center", borderWidth: 1, borderColor: c.border, borderRadius: 18, backgroundColor: c.surface, padding: 20, elevation: 16, shadowColor: c.shadow, shadowOpacity: 0.3, shadowRadius: 22, shadowOffset: { width: 0, height: 12 } },
    notebookContent: { paddingBottom: 4 },
    notebookDateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 },
    notebookDate: { flex: 1, color: c.primaryStrong, fontSize: 12, fontWeight: "700" },
    notebookTitleInput: { color: c.text, backgroundColor: "transparent", borderColor: "transparent", borderBottomColor: c.border, borderRadius: 0, borderBottomWidth: 1, fontSize: 20, fontWeight: "800", marginBottom: 14, paddingHorizontal: 4, paddingVertical: 9 },
    notebookViewTitle: { color: c.text, fontSize: 20, fontWeight: "800", marginBottom: 18 },
    notebookPaper: { position: "relative", minHeight: 360, marginTop: 8, overflow: "hidden", borderWidth: 1, borderColor: c.border, borderRadius: 10, backgroundColor: c.input },
    notebookGuideLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
    notebookRule: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: c.border },
    notebookMargin: { position: "absolute", top: 0, bottom: 0, left: 56, width: 1, backgroundColor: c.primary },
    notebookBodyInput: { minHeight: 360, color: c.text, backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, fontSize: 14, lineHeight: 27, textAlignVertical: "top", paddingTop: 7, paddingHorizontal: 10, paddingLeft: 16, marginBottom: 0, zIndex: 1 },
    notebookReadContent: { minHeight: 360, color: c.text, fontSize: 14, lineHeight: 27, paddingTop: 7, paddingHorizontal: 10, paddingLeft: 16, zIndex: 1 },
    notebookActions: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 14 },
    notebookSaveAction: { minHeight: 44, paddingHorizontal: 13, paddingVertical: 8, marginTop: 0 },
    notebookSaveActionText: { fontSize: 11 },
    notebookEditAction: { minHeight: 44, paddingHorizontal: 12 },
    notebookEditActionText: { fontSize: 11 },
    notebookCloseAction: { minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 13, borderWidth: 1, borderColor: c.border, borderRadius: 9, backgroundColor: c.surfaceAlt },
    notebookCloseActionText: { color: c.text, fontSize: 12, fontWeight: "700" },
    journalViewTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
      marginTop: 8,
    },
    journalViewContent: {
      color: c.text,
      fontSize: 14,
      lineHeight: 22,
      marginTop: 8,
      marginBottom: 10,
    },
    editButton: {
      minHeight: 42,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      borderRadius: 9,
      backgroundColor: "#1F7A45",
    },
    editButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
    editorHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    closeButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 9,
      borderWidth: 1,
      borderColor: c.border,
    },
    closeText: { color: c.muted, fontSize: 21 },
    label: { color: c.muted, fontSize: 12, fontWeight: "700", marginTop: 5 },
    body: { minHeight: 230 },
    message: { color: c.success, textAlign: "center", marginVertical: 8 },
    delete: {
      minHeight: 42,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 9,
      backgroundColor: "#C62828",
    },
    deleteText: { color: "#FFFFFF", fontWeight: "800" },
    fab: {
      position: "absolute",
      right: 17,
      bottom: 18,
      minHeight: 50,
      justifyContent: "center",
      paddingHorizontal: 18,
      borderRadius: 25,
      backgroundColor: c.primary,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    fabText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  });
