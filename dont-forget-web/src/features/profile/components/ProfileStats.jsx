export default function ProfileStats({ completedCount, translations }) {
  return (
    <div className="profile-stats">
      <div className="stat-card">
        <h3>{translations.statsCompletedTitle}</h3>
        <span className="stat-number">{completedCount}{translations.statsCountSuffix}</span>
        <p>{translations.statsCheer}</p>
      </div>
    </div>
  );
}
