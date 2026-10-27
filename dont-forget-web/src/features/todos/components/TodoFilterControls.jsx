import { TODO_FILTERS } from "@/shared/constants/todos";

export default function TodoFilterControls({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
  translations,
}) {
  return (
    <>
      <input
        type="text"
        placeholder={translations.phSearch}
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-input"
      />
      <div className="todo-filter-tabs">
        {TODO_FILTERS.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`todo-filter-button ${filterCategory === value ? "active" : ""}`}
          >
            {emoji ? <span aria-hidden="true">{emoji} </span> : null}{translations[label]}
          </button>
        ))}
      </div>
    </>
  );
}




