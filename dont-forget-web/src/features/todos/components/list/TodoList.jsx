import { useLanguage } from "@/shared/i18n/LanguageContext";
import TodoListItem from "./TodoListItem";

export default function TodoList({
  filteredTodos,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleToggleComplete,
  handleStartEdit,
  handleSaveEdit,
  handleDeleteTodo,
}) {
  const { t } = useLanguage();

  return (
    <div className="todo-list-container">
      <h3 className="section-title">
        {t.searchResultTitle} ({filteredTodos.length}{t.statsCountSuffix})
      </h3>
      {filteredTodos.length === 0 ? (
        <div className="empty-view">
          <p className="todo-empty-primary">{t.emptySearch1}</p>
          <p className="todo-empty-secondary">{t.emptySearch2}</p>
        </div>
      ) : (
        filteredTodos.map((todo) => (
          <TodoListItem
            key={todo._id}
            todo={todo}
            isEditing={editingId === todo._id}
            editText={editText}
            onEditTextChange={setEditText}
            onToggleComplete={handleToggleComplete}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingId(null)}
            onDelete={handleDeleteTodo}
          />
        ))
      )}
    </div>
  );
}




