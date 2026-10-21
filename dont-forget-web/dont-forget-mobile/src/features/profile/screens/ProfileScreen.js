import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";
import { ActionButton, FormField, LinkButton } from "../../../shared/components/FormControls";
import { apiGet } from "../../../services/api/client";
import { getProfile, saveProfile } from "../api/profileApi";

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [statusMessage, setStatusMessage] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([getProfile(), apiGet("/todos")]).then(([profileResult, todosResult]) => {
      if (!active) return;
      if (profileResult.status === "fulfilled" && profileResult.value.data?.user) {
        const profile = profileResult.value.data.user;
        setName(profile.name || user?.displayName || "");
        setStatusMessage(profile.statusMessage || "");
        setProfileImg(profile.profileImg || "");
      }
      if (todosResult.status === "fulfilled" && Array.isArray(todosResult.value.data?.todos)) {
        setCompletedCount(todosResult.value.data.todos.filter((todo) => todo.completed).length);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [user?.uid, user?.displayName]);

  const choosePhoto = async () => {
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.base64) throw new Error("선택한 이미지 데이터를 읽지 못했습니다.");
      const dataUri = "data:image/jpeg;base64," + asset.base64;
      if (dataUri.length > 2800000) {
        throw new Error("이미지가 너무 큽니다. 더 작은 사진을 선택해 주세요. (최대 2MB)");
      }
      setProfileImg(dataUri);
    } catch (pickError) {
      setError(pickError?.message || "사진을 불러오지 못했습니다.");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return setError("이름 또는 닉네임을 입력해 주세요.");
    if (name.trim().length > 60) return setError("이름은 60자 이내로 입력해 주세요.");
    if (statusMessage.length > 160) return setError("상태 메시지는 160자 이내로 입력해 주세요.");
    if (profileImg.length > 2800000) return setError("프로필 이미지는 2MB 이하로 선택해 주세요.");
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await saveProfile({ userName: name.trim(), statusMessage: statusMessage.trim(), profileImg });
      if (!response.data.success) throw new Error(response.data.message || "프로필을 저장하지 못했습니다.");
      if (user) await updateProfile(user, { displayName: name.trim() });
      setEditing(false);
      setNotice("프로필을 저장했습니다.");
    } catch (saveError) {
      setError(saveError?.response?.data?.message || saveError?.message || "프로필을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.title}>내 프로필</Text>
          {profileImg
            ? <Image source={{ uri: profileImg }} style={styles.avatar} onError={() => setProfileImg("")} />
            : <View style={styles.avatarFallback}><Text style={styles.avatarLetter}>{(name || "D").slice(0, 1)}</Text></View>}
          {editing ? <TouchableOpacity accessibilityRole="button" onPress={choosePhoto} style={styles.photoButton}><Text style={styles.photoButtonText}>사진 보관함에서 선택</Text></TouchableOpacity> : null}
          <Text style={styles.email}>{user?.email || ""}</Text>
          {loading ? <Text style={styles.muted}>프로필을 불러오는 중...</Text> : (
            <>
              <Text style={styles.label}>이름 / 닉네임</Text>
              <FormField value={name} onChangeText={setName} editable={editing} placeholder="이름 또는 닉네임" maxLength={60} />
              <Text style={styles.label}>상태 메시지</Text>
              <FormField value={statusMessage} onChangeText={setStatusMessage} editable={editing} placeholder="상태 메시지를 입력하세요" maxLength={160} />
              <View style={styles.stats}><Text style={styles.statLabel}>완료한 할 일</Text><Text style={styles.statValue}>{completedCount}개</Text></View>
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}
              {editing ? (
                <>
                  <ActionButton title="저장" onPress={handleSave} loading={saving} />
                  <LinkButton title="수정 취소" onPress={() => { setEditing(false); setError(""); }} />
                </>
              ) : (
                <ActionButton title="프로필 수정" onPress={() => { setNotice(""); setEditing(true); }} />
              )}
            </>
          )}
          <LinkButton title="메인으로 돌아가기" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#121212" },
  container: { flexGrow: 1, padding: 20, paddingTop: 48 },
  form: { width: "100%", maxWidth: 520, alignSelf: "center" },
  title: { color: "#fff", fontSize: 27, fontWeight: "bold", textAlign: "center", marginBottom: 22 },
  avatar: { width: 104, height: 104, borderRadius: 52, alignSelf: "center", marginBottom: 10, backgroundColor: "#242424" },
  avatarFallback: { width: 104, height: 104, borderRadius: 52, alignSelf: "center", marginBottom: 10, backgroundColor: "#263449", alignItems: "center", justifyContent: "center" },
  avatarLetter: { color: "#bfdbfe", fontSize: 42, fontWeight: "700" },
  photoButton: { alignSelf: "center", paddingVertical: 9, paddingHorizontal: 14, marginBottom: 8, borderRadius: 18, backgroundColor: "#202a39" },
  photoButtonText: { color: "#bfdbfe", fontSize: 13, fontWeight: "600" },
  email: { color: "#aaa", textAlign: "center", marginBottom: 24 },
  label: { color: "#d4d4d4", marginBottom: 8, fontWeight: "600" },
  stats: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#1e1e1e", padding: 16, borderRadius: 8, marginVertical: 12 },
  statLabel: { color: "#bbb" },
  statValue: { color: "#93c5fd", fontWeight: "700" },
  muted: { color: "#aaa", textAlign: "center", marginVertical: 24 },
  error: { color: "#fca5a5", textAlign: "center", marginBottom: 8 },
  notice: { color: "#86efac", textAlign: "center", marginBottom: 8 },
});
