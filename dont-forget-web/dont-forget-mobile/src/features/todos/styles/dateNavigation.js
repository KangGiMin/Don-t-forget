export const dateNavigationStyles = (colors) => ({
  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', gap: 4, paddingVertical: 4, marginBottom: 15 },
  dayCell: { flex: 1, minWidth: 0, minHeight: 72, borderRadius: 13, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayCellActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayName: { fontSize: 10, color: colors.muted, fontWeight: '600' },
  dayNumber: { fontSize: 15, color: colors.text, fontWeight: '800', marginTop: 3 },
  dayTextActive: { color: '#fff', fontWeight: '800' },
  dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent', marginTop: 3 },
  dayDotActive: { backgroundColor: '#fff' },
});