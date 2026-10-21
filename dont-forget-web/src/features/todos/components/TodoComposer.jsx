import { TODO_CATEGORIES } from "@/shared/constants/todos";

export default function TodoComposer({
  dueDate,
  category,
  onCategoryChange,
  text,
  onTextChange,
  onSubmit,
  translations,
}) {
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <div className="form-top-row">
        <span className="selected-date-text">{translations.targetDate} {dueDate}</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="select-box">
          {TODO_CATEGORIES.map(({ value, optionLabel }) => (
            <option key={value} value={value}>{translations[optionLabel]}</option>
          ))}
        </select>
      </div>
      <div className="form-input-row">
        <input
          type="text"
          placeholder={translations.phNewTodo}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          className="text-input"
        />
        <button type="submit" className="submit-btn">{translations.btnAdd}</button>
      </div>
    </form>
  );
}



