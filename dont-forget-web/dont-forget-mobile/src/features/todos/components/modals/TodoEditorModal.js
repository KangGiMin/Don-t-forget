import { useMobileLayout } from "../../../../shared/layout/useMobileLayout";
import React from 'react';
import { KeyboardAvoidingView, Platform, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActionButton, FormField } from '../../../../shared/components/FormControls';
import { TODO_CATEGORIES, TODO_CATEGORY_EMOJIS } from '../../store/todoStore';

export default function TodoEditorModal({
  visible,
  styles,
  editText,
  onEditTextChange,
  editCategory,
  onEditCategoryChange,
  editDueDate,
  onEditDueDateChange,
  onSave,
  onClose,
}) {
  const layout = useMobileLayout();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.modalShade, { paddingTop: layout.insets.top + 16, paddingBottom: layout.insets.bottom + 16 }]}>
        <ScrollView keyboardShouldPersistTaps="handled" style={[styles.modal, { maxHeight: "90%", width: "100%", maxWidth: 640, alignSelf: "center", padding: 0 }]} contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.modalTitle}>할 일 수정</Text>
          <FormField placeholder="할 일" value={editText} onChangeText={onEditTextChange} maxLength={200} />
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.editChips}>
            {TODO_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => onEditCategoryChange(category)}
                style={[styles.filter, editCategory === category && styles.filterSelected]}
              >
                <Text style={[styles.filterText, editCategory === category && styles.filterTextSelected]}>
                  {TODO_CATEGORY_EMOJIS[category]} {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>마감일 (YYYY-MM-DD)</Text>
          <FormField
            placeholder="YYYY-MM-DD"
            value={editDueDate}
            onChangeText={onEditDueDateChange}
            maxLength={10}
            keyboardType="numbers-and-punctuation"
          />
          <ActionButton title="변경 저장" onPress={onSave} />
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}