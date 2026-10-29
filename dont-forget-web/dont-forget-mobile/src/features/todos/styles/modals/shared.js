export const modalSharedStyles = (colors) => ({
  modalShade: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 18 },
  modal: { backgroundColor: colors.surface, padding: 19, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 19, fontWeight: '800', marginBottom: 16 },
  label: { color: colors.muted, marginBottom: 8, fontSize: 12, fontWeight: '700' },
  editChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  cancel: { alignItems: 'center', padding: 13 },
  cancelText: { color: colors.muted, fontWeight: '600' },
});