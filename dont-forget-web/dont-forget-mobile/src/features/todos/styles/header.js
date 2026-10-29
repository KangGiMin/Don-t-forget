export const headerStyles = (colors) => ({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 29, height: 29, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  brandCheck: { color: '#fff', fontSize: 19, fontWeight: '800' },
  brand: { color: colors.text, fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.primaryStrong, fontSize: 15, fontWeight: '800' },
  greetingRow: { marginBottom: 14 },
  eyebrow: { color: colors.primaryStrong, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: colors.text, fontSize: 23, fontWeight: '800', marginTop: 4 },
  greeting: { color: colors.muted, fontSize: 13, marginTop: 4 },
});