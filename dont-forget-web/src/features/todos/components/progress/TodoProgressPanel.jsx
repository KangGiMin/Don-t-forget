export default function TodoProgressPanel({
  isCompleted100,
  congratsLabel,
  dateLabel,
  targetRateLabel,
  completedCount,
  totalCount,
  doneLabel,
  progressPercent,
}) {
  return (
    <div className={`stats-container ${isCompleted100 ? "completed-100" : ""}`}>
      <div className="stats-info">
        {isCompleted100 ? (
          <span className="congrats-text">{congratsLabel}</span>
        ) : (
          <span>📌 {dateLabel} {targetRateLabel} ({completedCount}/{totalCount} {doneLabel})</span>
        )}
        <span className="stats-percent">{progressPercent}%</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className={`progress-bar-fill ${isCompleted100 ? "completed-100" : ""}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}



