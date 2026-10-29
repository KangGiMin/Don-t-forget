const TIER_LABELS = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
  platinum: '플래티넘',
  diamond: '다이아',
  emerald: '에메랄드',
  master: '마스터',
  grand_master: '그랜드 마스터',
  challenger: '챌린저',
};

export default function TierBadge({ tier }) {
  const tierKey = TIER_LABELS[tier?.key] ? tier.key : 'bronze';
  const tierName = TIER_LABELS[tierKey];

  return (
    <span
      className={`tier-badge tier-badge--${tierKey}`}
      role="img"
      aria-label={`${tierName} 티어 훈장`}
    >
      <span className="tier-medal-disc">
        <span className="tier-medal-star" aria-hidden="true">★</span>
      </span>
      <span className="tier-medal-ribbons" aria-hidden="true">
        <span />
        <span />
      </span>
    </span>
  );
}