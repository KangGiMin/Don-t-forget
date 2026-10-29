import Calendar from "react-calendar";

export default function TodoCalendarPanel({
  selectedDate,
  activeStartDate,
  onDateChange,
  onActiveStartDateChange,
  onResetToday,
  todayLabel,
  locale,
}) {
  return (
    <div className="calendar-section">
      <div className="today-btn-wrapper">
        <button onClick={onResetToday} className="today-btn">{todayLabel}</button>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate: nextDate }) => onActiveStartDateChange(nextDate)}
          formatDay={(_locale, date) => date.getDate()}
          locale={locale}
        />
      </div>
    </div>
  );
}



