export const calendarModalStyles = (colors) => ({
  calendarModal: { backgroundColor: colors.surface, padding: 19, paddingTop: 11, borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  sheetHandle: { width: 36, height: 4, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthArrow: { color: colors.primaryStrong, fontSize: 29, paddingHorizontal: 9 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 7, marginBottom: 13 },
  weekday: { width: '14.2857%', textAlign: 'center', color: colors.muted, fontSize: 11, fontWeight: '700', paddingVertical: 8 },
  calendarDay: { width: '14.2857%', minHeight: 41, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  calendarDayActive: { backgroundColor: colors.primary },
  calendarDayText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  outsideMonth: { color: colors.border },
  calendarTaskDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 2 },
  calendarNoDot: { height: 6 },
});