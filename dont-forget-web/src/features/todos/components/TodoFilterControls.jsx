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
        {TODO_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`todo-filter-button ${filterCategory === value ? "active" : ""}`}
          >
            {translations[label]}
          </button>
        ))}
      </div>
    </>
  );
}




