import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFeatureText } from "@/shared/i18n/featureTranslations";
import { TODO_CATEGORIES } from "@/shared/constants/todos";

function formatReminderOffset(value, translations) {
  const minutes = Number(value?.offsetMinutes ?? value);
  if (!Number.isFinite(minutes) || minutes < 1) return null;

  if (minutes % 1440 === 0) {
    return `${minutes / 1440} ${translations.reminderDays} ${translations.reminderBefore}`;
  }
  if (minutes % 60 === 0) {
    return `${minutes / 60} ${translations.reminderHours} ${translations.reminderBefore}`;
  }
  return `${minutes} ${translations.reminderMinutes} ${translations.reminderBefore}`;
}

export default function TodoListItem({
  todo,
  isEditing,
  editText,
  onEditTextChange,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  const { t, lang } = useLanguage();
  const featureText = getFeatureText(lang);

  const legacyCategories = {
    업무: { label: t.catWorkTxt, emoji: "💼" },
    개인: { label: t.catOtherTxt, emoji: "✨" },
  };
  const category = TODO_CATEGORIES.find(({ value }) => value === todo.category);
  const legacyCategory = legacyCategories[todo.category];
  const categoryLabel = category
    ? t[category.filterLabel]
    : legacyCategory?.label || todo.category;
  const categoryEmoji = category?.emoji || legacyCategory?.emoji;
  const reminderLabels = (Array.isArray(todo.reminders) ? todo.reminders : [])
    .map((reminder) => formatReminderOffset(reminder, featureText))
    .filter(Boolean);

  return (
    <div className="todo-item">
      <div className="todo-content-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          className="todo-checkbox"
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(event) => onEditTextChange(event.target.value)}
            className="edit-input"
            autoFocus
          />
        ) : (
          <div className="todo-text-area">
            <span className={`todo-text ${todo.completed ? "completed" : "active"}`}>
              {todo.text}
            </span>
            <span className="todo-category-badge">
              {categoryEmoji ? `${categoryEmoji} ` : ""}
              {categoryLabel}
            </span>
            <div className="todo-schedule-meta">
              <span>
                <strong aria-hidden="true">◷</strong> {featureText.todoDueTime}: {todo.dueDate || "—"} {todo.dueTime || "23:59"}
              </span>
              <span>
                <strong aria-hidden="true">🔔</strong> {featureText.todoReminders}: {reminderLabels.length ? reminderLabels.join(", ") : featureText.reminderNone}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="button-group">
        {isEditing ? (
          <>
            <button onClick={() => onSaveEdit(todo._id)} className="edit-btn">{t.btnSave}</button>
            <button onClick={onCancelEdit} className="cancel-btn">{t.btnCancel}</button>
          </>
        ) : (
          <>
            <button onClick={() => onStartEdit(todo)} className="edit-btn">{t.btnEdit}</button>
            <button onClick={() => onDelete(todo._id)} className="delete-btn">{t.btnDelete}</button>
          </>
        )}
      </div>
    </div>
  );
}
