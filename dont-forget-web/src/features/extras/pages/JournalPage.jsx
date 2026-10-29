import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFeatureText } from "@/shared/i18n/featureTranslations";
import { formatLocalDate, getTodayString } from "@/shared/utils/date";
import { getTodosAPI } from "@/features/todos/api/todoApi";
import { deleteJournal, getJournals, saveJournal } from "../api/extraApi";
import "./FeaturePages.css";

const toDateKey = (date) => formatLocalDate(date);

function getCalendarDates(month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const weekCount = Math.ceil((mondayOffset + daysInMonth) / 7);

  return Array.from({ length: weekCount * 7 }, (_, index) =>
    new Date(year, monthIndex, index - mondayOffset + 1),
  );
}

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
function getEventDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : toDateKey(date);
}

export default function JournalPage() {
  const { lang } = useLanguage();
  const t = getFeatureText(lang);
  const today = getTodayString();
  const [date, setDate] = useState(today);
  const [viewMonth, setViewMonth] = useState(() => new Date(`${today}T00:00:00`));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [journalDates, setJournalDates] = useState(() => new Set());

  const calendarDates = useMemo(() => getCalendarDates(viewMonth), [viewMonth]);
  const selectedTodos = useMemo(
    () => todos.filter((todo) => {
      const createdDate = getEventDate(todo.createdAt);
      const completedDate = getEventDate(todo.completedAt);
      return todo.dueDate === date || createdDate === date || completedDate === date;
    }),
    [date, todos],
  );
  const monthLabel = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
  }).format(viewMonth);
  const weekdays = [...t.weekdays.slice(1), t.weekdays[0]];
  const selectedDateLabel = new Intl.DateTimeFormat(lang, {
    dateStyle: "full",
  }).format(new Date(`${date}T00:00:00`));

  useEffect(() => {
    let active = true;
    const year = viewMonth.getFullYear();
    const month = String(viewMonth.getMonth() + 1).padStart(2, "0");
    const from = `${year}-${month}-01`;
    const to = toDateKey(new Date(year, viewMonth.getMonth() + 1, 0));

    getJournals(from, to)
      .then((result) => {
        if (active) setJournalDates(new Set((result.journals || []).map((journal) => journal.date)));
      })
      .catch(() => {
        if (active) setJournalDates(new Set());
      });

    return () => { active = false; };
  }, [viewMonth]);

  useEffect(() => {
    if (!editorOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setEditorOpen(false);
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editorOpen]);

  useEffect(() => {
    let active = true;
    getJournals(date).then((result) => {
      if (!active) return;
      const journal = result.journals?.[0];
      setTitle(journal?.title || "");
      setContent(journal?.content || "");
      setSaved(Boolean(journal));
      setMessage("");
    }).catch(() => {
      if (active) setMessage(t.saveFailed);
    });
    return () => { active = false; };
  }, [date, t.saveFailed]);


  const selectDate = (dateKey) => {
    setDate(dateKey);
    setSaved(journalDates.has(dateKey));
    setEditorOpen(false);
    setIsEditing(false);
    setMessage("");
  };

  const changeMonth = (offset) => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const submit = async (event) => {
    event.preventDefault();
    const result = await saveJournal({ date, title, content });
    if (result.success) {
      setSaved(true);
      setJournalDates((current) => new Set([...current, date]));
      setMessage(t.journalSaved);
      setIsEditing(false);
    } else {
      setMessage(result.message || t.saveFailed);
    }
  };

  const remove = async () => {
    const result = await deleteJournal(date);
    if (result.success) {
      setTitle("");
      setContent("");
      setSaved(false);
      setJournalDates((current) => {
        const updated = new Set(current);
        updated.delete(date);
        return updated;
      });
      setMessage("");
      setEditorOpen(false);
      setIsEditing(false);
    }
  };

  const closeJournal = () => {
    setEditorOpen(false);
    setIsEditing(false);
  };
  const openJournal = () => {
    if (editorOpen) {
      setEditorOpen(false);
      setIsEditing(false);
      return;
    }
    setEditorOpen(true);
    setIsEditing(!saved);
  };

  return (
    <main className="feature-page journal-page">
      <header className="feature-page-header journal-page-header">
        <a href="/todo" aria-label={t.navTodos}>‹</a>
        <div>
          <p>REFLECT & REMEMBER</p>
          <h1>{t.journalTitle}</h1>
        </div>
      </header>

      <section className="feature-card journal-calendar" aria-label={t.journalTitle}>
        <div className="journal-calendar-heading">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
          <h2>{monthLabel}</h2>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
          <button
            type="button"
            className="journal-today-button"
            onClick={() => {
              setDate(today);
              setViewMonth(new Date(`${today}T00:00:00`));
            }}
          >
            {lang === "ko" ? "오늘" : "Today"}
          </button>
        </div>

        <div className="journal-calendar-grid journal-weekdays" aria-hidden="true">
          {weekdays.map((weekday, index) => (
            <span
              key={`${weekday}-${index}`}
              className={index === 5 ? "saturday" : index === 6 ? "sunday" : ""}
            >
              {weekday}
            </span>
          ))}
        </div>
        <div className="journal-calendar-grid journal-days">
          {calendarDates.map((calendarDate) => {
            const dateKey = toDateKey(calendarDate);
            const inMonth = calendarDate.getMonth() === viewMonth.getMonth();
            const hasTodos = todos.some((todo) => (
              todo.dueDate === dateKey
              || getEventDate(todo.createdAt) === dateKey
              || getEventDate(todo.completedAt) === dateKey
            ));
            const hasJournal = journalDates.has(dateKey);
            const isToday = dateKey === today;

            return (
              <button
                key={dateKey}
                type="button"
                className={[
                  "journal-day",
                  !inMonth && "outside-month",
                  dateKey === date && "selected",
                  isToday && "today",
                ].filter(Boolean).join(" ")}
                onClick={() => selectDate(dateKey)}
                aria-pressed={dateKey === date}
                aria-label={dateKey}
              >
                <span className="journal-day-number">{calendarDate.getDate()}</span>
                <span className="journal-day-indicators" aria-hidden="true">
                  {hasTodos ? <i className="journal-todo-dot" /> : null}
                  {hasJournal ? <i className="journal-entry-dot" /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="journal-calendar-legend">
          <span><i className="journal-todo-dot" /> {t.journalTodos}</span>
          <span><i className="journal-entry-dot" /> {t.journalTitle}</span>
        </div>
      </section>

      <section className="journal-day-panel">
        <div className="journal-day-heading">
          <div>
            <p>{t.journalTodos}</p>
            <h2>{selectedDateLabel}</h2>
          </div>
          <span>{selectedTodos.length}</span>
        </div>
        {selectedTodos.length ? (
          <ul className="journal-todo-list">
            {selectedTodos.map((todo) => {
              const completedOnSelectedDate = getEventDate(todo.completedAt) === date;
              const reminders = (Array.isArray(todo.reminders) ? todo.reminders : [])
                .map((reminder) => formatReminderOffset(reminder, t))
                .filter(Boolean);
              const details = [
                todo.dueDate === date ? `${t.todoDueTime}: ${todo.dueTime || "23:59"}` : null,
                `${t.todoReminders}: ${reminders.length ? reminders.join(", ") : t.reminderNone}`,
                todo.completed ? t.journalCompleted : t.journalInProgress,
              ].filter(Boolean);
              return (
                <li key={todo._id} className="journal-todo-row">
                  <span className={`journal-todo-status ${todo.completed ? "completed" : "pending"}`}>
                    {todo.completed ? "✓" : "○"}
                  </span>
                  <div>
                    <strong>{todo.text}</strong>
                    <p>{details.join(" · ")}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="journal-no-todos">{t.journalNoTodos}</p>
        )}
      </section>

      {editorOpen ? (
        <div
          className="journal-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeJournal();
          }}
        >
          <section
            className="journal-notebook-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={saved && !isEditing ? t.journalView : t.journalWrite}
          >
            {saved && !isEditing ? (
              <article className="journal-notebook journal-notebook-view">
                <div className="journal-notebook-date-row">
                  <p className="journal-notebook-date">📅 {selectedDateLabel}</p>
                  <button type="button" className="journal-notebook-close" onClick={closeJournal} aria-label={t.journalClose}>×</button>
                </div>
                <h2 className="journal-notebook-view-title">{title || t.journalTitlePlaceholder}</h2>
                <div className="journal-notebook-paper journal-notebook-read-paper">
                  <p className="journal-notebook-read-content">{content}</p>
                </div>
                <div className="feature-actions journal-notebook-actions">
                  <button className="feature-primary journal-edit-button" type="button" onClick={() => setIsEditing(true)}>
                    <span aria-hidden="true">✎</span> {t.journalEdit}
                  </button>
                  <button className="journal-notebook-secondary" type="button" onClick={closeJournal}>{t.journalClose}</button>
                </div>
              </article>
            ) : (
              <form className="journal-notebook" onSubmit={submit}>
                <div className="journal-notebook-date-row">
                  <p className="journal-notebook-date">📅 {selectedDateLabel}</p>
                  <button type="button" className="journal-notebook-close" onClick={closeJournal} aria-label={t.journalClose}>×</button>
                </div>
                <input
                  className="journal-notebook-title-input"
                  aria-label={t.journalTitlePlaceholder}
                  placeholder={t.journalTitlePlaceholder}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                />
                <div className="journal-notebook-paper">
                  <textarea
                    className="journal-notebook-body-input"
                    aria-label={t.journalBody}
                    placeholder={t.journalBody}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    maxLength={20000}
                    rows={9}
                    required
                  />
                </div>
                {message ? <p role="status" className="journal-notebook-message">{message}</p> : null}
                <div className="feature-actions journal-notebook-actions">
                  <button className="feature-primary journal-save-button" type="submit">{saved ? t.journalSaveChanges : t.journalSave}</button>
                  {saved ? <button className="journal-delete-button" type="button" onClick={remove}>{t.commonDelete}</button> : null}
                  <button className="journal-notebook-secondary" type="button" onClick={closeJournal}>{t.journalClose}</button>
                </div>
              </form>
            )}
          </section>
        </div>
      ) : null}
      <button
        type="button"
        className="journal-write-fab"
        onClick={openJournal}
        aria-expanded={editorOpen}
      >
        <span aria-hidden="true">{editorOpen ? "×" : saved ? "◉" : "＋"}</span>
        {editorOpen ? t.journalClose : saved ? t.journalView : t.journalWrite}
      </button>
    </main>
  );
}
