import { useMobileLayout } from "../../../../shared/layout/useMobileLayout";
import React from 'react';
import { KeyboardAvoidingView, Platform, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActionButton } from '../../../../shared/components/FormControls';
import { formatLocalDate } from '../../../../shared/utils/date';

export default function CalendarPickerModal({
  visible,
  styles,
  month,
  monthCells,
  weekdays,
  todos,
  selectedDate,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onClose,
}) {
  const layout = useMobileLayout();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.modalShade, { paddingTop: layout.insets.top + 16, paddingBottom: layout.insets.bottom + 16 }]}>
        <ScrollView keyboardShouldPersistTaps="handled" style={[styles.calendarModal, { maxHeight: "90%", width: "100%", maxWidth: 640, alignSelf: "center", padding: 0 }]} contentContainerStyle={{ padding: 20 }}>
          <View style={styles.sheetHandle} />
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={onPreviousMonth} accessibilityRole="button" accessibilityLabel="이전 달">
              <Text style={styles.monthArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{month.getFullYear()}년 {month.getMonth() + 1}월</Text>
            <TouchableOpacity onPress={onNextMonth} accessibilityRole="button" accessibilityLabel="다음 달">
              <Text style={styles.monthArrow}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarGrid}>
            {weekdays.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}
            {monthCells.map((date, index) => {
              const value = formatLocalDate(date);
              const active = value === selectedDate;
              const inMonth = date.getMonth() === month.getMonth();
              const hasTasks = todos.some((todo) => todo.dueDate === value);
              return (
                <TouchableOpacity
                  key={`${value}-${index}`}
                  onPress={() => onSelectDate(value)}
                  style={[styles.calendarDay, active && styles.calendarDayActive]}
                  accessibilityRole="button"
                  accessibilityLabel={value}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.calendarDayText, !inMonth && styles.outsideMonth, active && styles.dayTextActive]}>
                    {date.getDate()}
                  </Text>
                  {hasTasks
                    ? <View style={[styles.calendarTaskDot, active && styles.dayDotActive]} />
                    : <View style={styles.calendarNoDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
          <ActionButton title="오늘로 이동" secondary onPress={onToday} />
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>닫기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}