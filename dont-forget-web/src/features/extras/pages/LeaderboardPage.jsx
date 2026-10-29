import { useEffect, useState } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFeatureText } from "@/shared/i18n/featureTranslations";
import { getLeaderboard, getMyStats } from "../api/extraApi";
import TierBadge from "../components/TierBadge";
import "./FeaturePages.css";
const medals = ["🥇 1", "🥈 2", "🥉 3"];
export default function LeaderboardPage() {
  const { lang } = useLanguage();
  const t = getFeatureText(lang);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    Promise.all([getLeaderboard(), getMyStats()]).then(([leaders, mine]) => {
      if (leaders.success) setRows(leaders.leaderboard);
      if (mine.success) setStats(mine.stats);
    });
  }, []);
  const tierClass = String(stats?.tier?.key || "bronze").replaceAll("_", "-");

  return (
    <main className="feature-page">
      <header className="feature-page-header">
        <a href="/todo">‹</a>
        <div>
          <p>LANKING</p>
          <h1>{t.leaderboardTitle}</h1>
        </div>
      </header>
      {stats ? (
        <section className={`tier-summary tier-summary--${tierClass}`}>
          <div className="tier-summary-item tier-summary-item--tier">
            <span>{t.leaderboardMyTier}</span>
            <strong>{stats.tier.name}</strong>
            <TierBadge tier={stats.tier} />
          </div>
          <div className="tier-summary-item">
            <span>{t.leaderboardMyPoints}</span>
            <strong>{stats.tierPoints}</strong>
          </div>
          <div className="tier-summary-item">
            <span>{t.leaderboardDailyLimit}</span>
            <strong>
              {stats.dailyTierPoints}/{stats.dailyTierPointLimit}
            </strong>
          </div>
          {stats.nextTier ? (
            <p>
               {t.leaderboardMyPoints}를 {stats.pointsToNextTier}점 더 쌓으면 →{" "}
              {stats.nextTier.name} 등급이 됩니다!
            </p>
          ) : (
            <p>🏆</p>
          )}
        </section>
      ) : null}
      <section className="leaderboard-list">
        {rows.length ? (
          rows.map((row) => (
            <article
              key={row.userId}
              className={`feature-card leaderboard-row ${row.rank <= 3 ? `rank-${row.rank}` : ""}`}
            >
              <span className="rank-medal">
                {medals[row.rank - 1] || row.rank}
              </span>
              {row.profileImg ? (
                <img src={row.profileImg} alt="" />
              ) : (
                <span className="rank-avatar">{row.name.slice(0, 1)}</span>
              )}
              <strong>{row.name}</strong>
              <span className="leader-count">
                {row.completedCount} {t.leaderboardCompleted}
              </span>
            </article>
          ))
        ) : (
          <p className="feature-empty">{t.leaderboardEmpty}</p>
        )}
      </section>
    </main>
  );
}
