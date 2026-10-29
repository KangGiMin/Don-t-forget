import { useMobileLayout, useReadableStyles } from "../../../shared/layout/useMobileLayout";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiGet, getApiErrorMessage } from "../../../services/api/client";
import { useTheme } from "../../../shared/theme/ThemeContext";
import TierBadge from "../components/TierBadge";
const medals = ["🥇 1", "🥈 2", "🥉 3"];
const TIER_GLOW_COLORS = {
  bronze: "#B87333",
  silver: "#A8B4C1",
  gold: "#E6B93F",
  platinum: "#93B5D4",
  diamond: "#55CFE0",
  emerald: "#22A77C",
  master: "#A477E8",
  "grand-master": "#E15B79",
  challenger: "#E84C42",
};
export default function LeaderboardScreen({ navigation }) {
  const { colors } = useTheme();
  const layout = useMobileLayout();
  const s = useReadableStyles(styles, colors);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([apiGet("/leaderboard"), apiGet("/leaderboard/me")])
      .then(([a, b]) => {
        if (a.data.success) setRows(a.data.leaderboard);
        if (b.data.success) setStats(b.data.stats);
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);
  const tierKey = String(stats?.tier?.key || "bronze").replaceAll("_", "-");
  const tierGlow = TIER_GLOW_COLORS[tierKey] || TIER_GLOW_COLORS.bronze;

  return (
    <ScrollView style={s.safe} contentContainerStyle={[s.container, layout.pageContent]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={s.back}>‹ 메인으로</Text>
      </TouchableOpacity>
      <Text style={s.eyebrow}>LANKING</Text>
      <Text style={s.title}>명예의 전당</Text>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.danger, marginBottom: 16 }}>{error}</Text> : null}
      {stats ? (
        <View style={[s.summary, { borderColor: tierGlow, shadowColor: tierGlow }]}>
          <View style={[s.summaryItem, s.summaryTier]}>
            <Text style={s.summaryLabel}>내 티어</Text>
            <Text style={s.summaryValue}>{stats.tier.name}</Text>
            <TierBadge tierKey={stats.tier.key} />
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryLabel}>티어 점수</Text>
            <Text style={s.summaryValue}>{stats.tierPoints}</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryLabel}>오늘 인정</Text>
            <Text style={s.summaryValue}>
              {stats.dailyTierPoints}/{stats.dailyTierPointLimit}
            </Text>
          </View>
          <Text style={s.next}>
            {stats.nextTier
              ? `${stats.pointsToNextTier}점 → ${stats.nextTier.name}`
              : "최고 티어입니다!"}
          </Text>
        </View>
      ) : null}
      <Text style={s.section}>누적 완료 순위</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : rows.length ? (
        rows.map((item) => (
          <View key={item.userId} style={[s.row, item.rank <= 3 && s.topRow]}>
            <Text style={s.medal}>{medals[item.rank - 1] || item.rank}</Text>
            {item.profileImg ? (
              <View style={s.image}>
                <Text>●</Text>
              </View>
            ) : (
              <View style={s.avatar}>
                <Text style={s.avatarText}>{item.name.slice(0, 1)}</Text>
              </View>
            )}
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.count}>{item.completedCount}개</Text>
          </View>
        ))
      ) : (
        <Text style={s.meta}>아직 순위 데이터가 없습니다.</Text>
      )}
    </ScrollView>
  );
}
const styles = (c) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    container: { padding: 20, paddingTop: 38, paddingBottom: 50 },
    back: { color: c.primaryStrong, fontSize: 15, marginBottom: 20 },
    eyebrow: {
      color: c.primaryStrong,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },
    title: {
      color: c.text,
      fontSize: 25,
      fontWeight: "800",
      marginTop: 5,
      marginBottom: 16,
    },
    summary: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 8,
      backgroundColor: c.primary,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.primary,
      shadowOpacity: 0.38,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    summaryItem: {
      width: "46%",
      minHeight: 92,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
      borderRadius: 12,
      backgroundColor: "rgba(10,35,64,0.12)",
      padding: 10,
    },
    summaryTier: { width: "100%", minHeight: 128 },
    summaryLabel: { color: "#E6F0FA", fontSize: 11, textAlign: "center" },
    summaryValue: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "800",
      marginTop: 5,
      textAlign: "center",
    },
    next: {
      width: "100%",
      color: "#E6F0FA",
      fontSize: 12,
      textAlign: "center",
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.2)",
      paddingTop: 12,
      marginTop: 4,
    },
    section: {
      color: c.text,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 13,
      padding: 13,
      marginBottom: 8,
    },
    topRow: { borderColor: c.primary },
    medal: {
      minWidth: 30,
      textAlign: "center",
      fontSize: 19,
      color: c.primaryStrong,
      fontWeight: "800",
    },
    image: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: c.primaryStrong, fontWeight: "800" },
    name: { flex: 1, color: c.text, fontWeight: "700" },
    count: { color: c.primaryStrong, fontWeight: "700" },
    meta: { color: c.muted, textAlign: "center", padding: 20 },
  });
