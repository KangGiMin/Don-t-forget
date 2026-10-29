import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '../../../../shared/components/FormControls';
import TodoComposer from '../composer/TodoComposer';
import { TODO_CATEGORIES, TODO_CATEGORY_EMOJIS } from '../../store/todoStore';
import { toDate, toIso, VIEW_FILTERS, WEEKDAYS } from '../../utils/calendar';

export default function MainDashboardHeader({
  styles,
  displayName,
  avatarLabel,
  onOpenSettings,
  inputText,
  onInputTextChange,
  onAddTodo,
  category,
  onCategoryChange,
  dueDate,
  dueTime,
  onDueTimeChange,
  reminders,
  onRemindersChange,
  onOpenCalendar,
  selectedDate,
  dateTodos,
  completedCount,
  progress,
  week,
  onSelectDate,
  viewFilter,
  onViewFilterChange,
  todos,
  filterCategory,
  onFilterCategoryChange,
  searchTerm,
  onSearchTermChange,
  error,
  formError,
  filteredTodoCount,
}) {
  const displayNameText = displayName ? `${displayName}님, 안녕하세요` : '오늘도 차근차근';
  const avatarText = avatarLabel.slice(0, 1).toUpperCase();

  return (
    <View>
      <View style={styles.topBar}>
        <View style={styles.brandLine}>
          <View style={styles.brandMark}><Text style={styles.brandCheck}>✓</Text></View>
          <Text style={styles.brand}>Don&apos;t forget</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="설정 열기" style={styles.avatar} onPress={onOpenSettings}><Text style={styles.avatarText}>{avatarText}</Text></TouchableOpacity>
      </View>
      <View style={styles.greetingRow}>
        <Text style={styles.eyebrow}>MY DAY</Text>
        <Text style={styles.title}>{displayNameText}</Text>
        <Text style={styles.greeting}>오늘 할 일을 하나씩 완료해 보세요.</Text>
      </View>
      <TouchableOpacity accessibilityRole="button" onPress={onOpenCalendar} style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.progressDate}>
              {toDate(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
            </Text>
            <Text style={styles.progressCaption}>
              {dateTodos.length ? `${completedCount}개 완료 · ${dateTodos.length}개 중` : '오늘의 계획을 추가해 보세요'}
            </Text>
          </View>
          <Text style={styles.progressPercent}>{progress}<Text style={styles.progressPercentSign}>%</Text></Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.calendarHint}>달력에서 날짜 선택  ›</Text>
      </TouchableOpacity>
      <View style={styles.weekStrip}>
        {week.map((date) => {
          const value = toIso(date);
          const active = value === selectedDate;
          return (
            <TouchableOpacity key={value} onPress={() => onSelectDate(value)} style={[styles.dayCell, active && styles.dayCellActive]}>
              <Text style={[styles.dayName, active && styles.dayTextActive]}>{WEEKDAYS[(date.getDay() + 6) % 7]}</Text>
              <Text style={[styles.dayNumber, active && styles.dayTextActive]}>{date.getDate()}</Text>
              <View style={[styles.dayDot, active && styles.dayDotActive]} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.viewTabs}>
        {VIEW_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => onViewFilterChange(filter)}
            style={[styles.viewTab, viewFilter === filter && styles.viewTabActive]}
          >
            <Text style={[styles.viewTabText, viewFilter === filter && styles.viewTabTextActive]}>{filter}</Text>
            {filter === '완료' && todos.some((todo) => todo.completed) ? <View style={styles.tabDot} /> : null}
          </TouchableOpacity>
        ))}
      </View>
      <TodoComposer
        value={inputText}
        onChangeText={onInputTextChange}
        onSubmit={onAddTodo}
        category={category}
        onCategoryChange={onCategoryChange}
        dueDate={dueDate}
        dueTime={dueTime}
        onDueTimeChange={onDueTimeChange}
        reminders={reminders}
        onRemindersChange={onRemindersChange}
        onPickDate={onOpenCalendar}
      />
      <Text style={styles.sectionLabel}>빠른 분류</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {['전체', ...TODO_CATEGORIES].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => onFilterCategoryChange(filter)}
            style={[styles.filter, filterCategory === filter && styles.filterSelected]}
          >
            <Text style={[styles.filterText, filterCategory === filter && styles.filterTextSelected]}>
              {TODO_CATEGORY_EMOJIS[filter] ? `${TODO_CATEGORY_EMOJIS[filter]} ` : ''}{filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FormField
        style={styles.search}
        placeholder="⌕  할 일 검색"
        value={searchTerm}
        onChangeText={onSearchTermChange}
        returnKeyType="search"
      />
      {error || formError ? <Text accessibilityRole="alert" style={styles.error}>{error || formError}</Text> : null}
      <View style={styles.listHeading}>
        <Text style={styles.listTitle}>{viewFilter === '오늘' ? '오늘의 할 일' : viewFilter}</Text>
        <Text style={styles.listCount}>{filteredTodoCount}개</Text>
      </View>
    </View>
  );
}