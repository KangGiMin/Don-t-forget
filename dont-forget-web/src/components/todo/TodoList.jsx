import { useLanguage } from "../../locales/LanguageContext";

// 📦 MainPage에서 택배로 보내준 데이터와 리모컨(함수)들을 여기서 받아서 씁니다!
function TodoList({
  filteredTodos,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleToggleComplete,
  handleStartEdit,
  handleSaveEdit,
  handleDeleteTodo
}) {
  const { t } = useLanguage(); 

  return (
    <div className="todo-list-container">
      <h3 className="section-title">
        {t.searchResultTitle} ({filteredTodos.length}{t.statsCountSuffix})
      </h3>
      
      {filteredTodos.length === 0 ? (
        <div className="empty-view">
          <p style={{ fontSize: "16px", margin: "0 0 6px 0" }}>{t.emptySearch1}</p>
          <p style={{ fontSize: "13px", margin: 0 }}>{t.emptySearch2}</p>
        </div>
      ) : (
        filteredTodos.map((todo) => (
          <div key={todo._id} className="todo-item">
            <div className="todo-content-wrapper">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="todo-checkbox"
              />
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                  autoFocus
                />
              ) : (
                <div className="todo-text-area">
                  <span className={`todo-text ${todo.completed ? "completed" : "active"}`}>
                    {todo.text}
                  </span>
                  <span className="todo-category-badge">
                    {todo.category === "업무" ? t.catWorkTxt :
                     todo.category === "공부" ? t.catStudyTxt :
                     todo.category === "개인" ? t.catPersonalTxt :
                     todo.category === "기타" ? t.catOtherTxt : todo.category}
                  </span>
                </div>
              )}
            </div>
            
            <div className="button-group">
              {editingId === todo._id ? (
                <>
                  <button onClick={() => handleSaveEdit(todo._id)} className="edit-btn">{t.btnSave}</button>
                  <button onClick={() => setEditingId(null)} className="delete-btn">{t.btnCancel}</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleStartEdit(todo)} className="edit-btn">{t.btnEdit}</button>
                  <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">{t.btnDelete}</button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TodoList;