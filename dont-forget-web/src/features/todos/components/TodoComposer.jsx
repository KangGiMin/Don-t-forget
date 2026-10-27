import { useState } from "react";
import { TODO_CATEGORIES } from "@/shared/constants/todos";

export default function TodoComposer({ dueDate, dueTime, onDueTimeChange, reminders = [], onRemindersChange, category, onCategoryChange, text, onTextChange, onSubmit, translations }) {
  const [customAmount, setCustomAmount] = useState("15");
  const [customUnit, setCustomUnit] = useState("minutes");
  const addReminder = () => {
    const amount = Number(customAmount);
    const multiplier = customUnit === "hours" ? 60 : customUnit === "days" ? 1440 : 1;
    const offset = Math.round(amount * multiplier);
    if (!Number.isFinite(offset) || offset < 1 || offset > 43200) return;
    onRemindersChange([...new Set([...reminders, offset])].sort((a, b) => b - a));
  };
  const formatOffset = (minutes) => minutes % 1440 === 0 ? `${minutes / 1440} ${translations.reminderDays || "일"} ${translations.reminderBefore || "전"}` : minutes % 60 === 0 ? `${minutes / 60} ${translations.reminderHours || "시간"} ${translations.reminderBefore || "전"}` : `${minutes} ${translations.reminderMinutes || "분"} ${translations.reminderBefore || "전"}`;
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <div className="form-top-row">
        <span className="selected-date-text">{translations.targetDate} {dueDate}</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="select-box">
          {TODO_CATEGORIES.map(({ value, emoji, optionLabel }) => <option key={value} value={value}>{emoji} {translations[optionLabel]}</option>)}
        </select>
      </div>
      <div className="form-input-row">
        <input type="text" placeholder={translations.phNewTodo} value={text} onChange={(event) => onTextChange(event.target.value)} className="text-input" maxLength={200} />
        <button type="submit" className="submit-btn">{translations.btnAdd}</button>
      </div>
      <div className="deadline-options">
        <label className="deadline-field"><span>{translations.todoDueTime || "마감 시각"}</span><input type="time" value={dueTime} onChange={(event) => onDueTimeChange(event.target.value)} required /></label>
        <div className="reminder-editor">
          <span className="deadline-label">{translations.todoReminders || "미리 알림"}</span>
          <div className="reminder-controls"><input aria-label={translations.reminderAmount || "알림 간격"} type="number" min="1" max={customUnit === "days" ? "30" : customUnit === "hours" ? "720" : "43200"} value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} />
            <select value={customUnit} onChange={(event) => setCustomUnit(event.target.value)}><option value="minutes">{translations.reminderMinutes || "분"}</option><option value="hours">{translations.reminderHours || "시간"}</option><option value="days">{translations.reminderDays || "일"}</option></select>
            <button type="button" onClick={addReminder}>{translations.reminderAdd || "추가"}</button>
          </div>
          <div className="reminder-chips">{reminders.map((offset) => <button key={offset} type="button" title={translations.reminderRemove || "알림 삭제"} onClick={() => onRemindersChange(reminders.filter((item) => item !== offset))}>{formatOffset(offset)} <span aria-hidden="true">×</span></button>)}</div>
        </div>
      </div>
    </form>
  );
}
