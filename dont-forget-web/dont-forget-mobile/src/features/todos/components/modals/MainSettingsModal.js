import { useMobileLayout } from "../../../../shared/layout/useMobileLayout";
import React from 'react';
import { KeyboardAvoidingView, Platform, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const THEME_OPTIONS = [
  { value: 'light', label: '☀️ 라이트' },
  { value: 'dark', label: '🌙 다크' },
  { value: 'system', label: '📱 시스템' },
];

export default function MainSettingsModal({
  visible,
  styles,
  themeMode,
  onThemeChange,
  onNavigate,
  onEnablePush,
  onLogout,
  onClose,
}) {
  const layout = useMobileLayout();
  const menuItems = [
    { label: '👤  내 프로필', route: 'Profile' },
    { label: '🎧  관리자에게 문의하기', route: 'ContactAdmin' },
    { label: '🔁  반복 루틴', route: 'Routines' },
    { label: '📔  오늘의 일기', route: 'Journal' },
    { label: '🏆  명예의 전당', route: 'Leaderboard' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.modalShade, { paddingTop: layout.insets.top + 16, paddingBottom: layout.insets.bottom + 16 }]}>
        <ScrollView keyboardShouldPersistTaps="handled" style={[styles.settingsModal, { maxHeight: "90%", width: "100%", maxWidth: 640, alignSelf: "center", padding: 0 }]} contentContainerStyle={{ padding: 20 }}>
          <View style={styles.settingsHeader}>
            <Text style={styles.modalTitle}>메뉴 및 설정</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="설정 닫기">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          {menuItems.map(({ label, route }) => (
            <TouchableOpacity key={route} style={styles.settingsLink} onPress={() => onNavigate(route)}>
              <Text style={styles.settingsLinkText}>{label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.settingsLink} onPress={onEnablePush}>
            <Text style={styles.settingsLinkText}>🔔  모바일 푸시 알림 켜기</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <Text style={styles.label}>화면 테마</Text>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onThemeChange(option.value)}
                style={[styles.themeOption, themeMode === option.value && styles.themeOptionActive]}
              >
                <Text style={[styles.themeOptionText, themeMode === option.value && styles.themeOptionTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.logout} onPress={onLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}