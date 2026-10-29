import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TIER_BADGE_COLORS = {
  bronze: { medal: '#B87333', ribbon: '#75421F', shine: '#F0BD7A' },
  silver: { medal: '#A8B4C1', ribbon: '#667381', shine: '#F3F6F8' },
  gold: { medal: '#E6B93F', ribbon: '#966C13', shine: '#FFF0A6' },
  platinum: { medal: '#93B5D4', ribbon: '#486985', shine: '#E5F4FF' },
  diamond: { medal: '#55CFE0', ribbon: '#176E87', shine: '#C8FBFF' },
  emerald: { medal: '#22A77C', ribbon: '#125D47', shine: '#B1F3D8' },
  master: { medal: '#A477E8', ribbon: '#57328F', shine: '#E8D5FF' },
  'grand-master': { medal: '#E15B79', ribbon: '#8A2942', shine: '#FFD3DC' },
  challenger: { medal: '#E84C42', ribbon: '#8E251F', shine: '#FFD0B8' },
};

const TIER_NAMES = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
  platinum: '플래티넘',
  diamond: '다이아',
  emerald: '에메랄드',
  master: '마스터',
  'grand-master': '그랜드 마스터',
  challenger: '챌린저',
};

export default function TierBadge({ tierKey }) {
  const key = TIER_BADGE_COLORS[tierKey] ? tierKey : 'bronze';
  const palette = TIER_BADGE_COLORS[key];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${TIER_NAMES[key]} 티어 훈장`}
      style={styles.badge}
    >
      <View style={[styles.medal, { backgroundColor: palette.medal, borderColor: palette.shine }]}>
        <View style={[styles.medalInner, { borderColor: palette.shine }]}>
          <Text style={[styles.star, { color: palette.shine }]}>★</Text>
        </View>
      </View>
      <View style={styles.ribbonRow}>
        <View style={[styles.ribbon, { backgroundColor: palette.ribbon, borderColor: palette.shine }]} />
        <View style={[styles.ribbon, { backgroundColor: palette.ribbon, borderColor: palette.shine }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center', marginTop: 5, width: 54, height: 65 },
  medal: { width: 43, height: 43, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  medalInner: { width: 33, height: 33, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 19, fontWeight: '900', lineHeight: 23 },
  ribbonRow: { flexDirection: 'row', gap: 5, marginTop: -7 },
  ribbon: { width: 11, height: 25, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 1 },
});