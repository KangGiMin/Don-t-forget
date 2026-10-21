import { useLanguage } from "@/shared/i18n/LanguageContext";

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
  const { t } = useLanguage();

  const categoryLabel = {
    업무: t.catWorkTxt,
    공부: t.catStudyTxt,
    개인: t.catPersonalTxt,
    기타: t.catOtherTxt,
  }[todo.category] || todo.category;

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
            <span className="todo-category-badge">{categoryLabel}</span>
          </div>
        )}
      </div>
      <div className="button-group">
        {isEditing ? (
          <>
            <button onClick={() => onSaveEdit(todo._id)} className="edit-btn">{t.btnSave}</button>
            <button onClick={onCancelEdit} className="delete-btn">{t.btnCancel}</button>
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



