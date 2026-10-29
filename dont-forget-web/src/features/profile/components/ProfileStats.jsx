export default function ProfileStats({ completedCount, tier, translations }) {
  const tierKey = String(tier?.key || "bronze").replaceAll("_", "-");

  return (
    <div className="profile-stats">
      <div className="stat-card">
        <h3>{translations.statsCompletedTitle}</h3>
        <div className="stat-summary-row">
          <span className="stat-number">
            {completedCount}{translations.statsCountSuffix}
          </span>
          {tier ? (
            <>
              <span className="stat-summary-divider" aria-hidden="true" />
              <span
                className={`profile-tier-tag profile-tier-tag--${tierKey}`}
                aria-label={`현재 티어: ${tier.name}`}
              >
                {tier.name}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

