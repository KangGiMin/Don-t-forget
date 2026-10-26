import { useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";
import confetti from "canvas-confetti";
import { signOut } from "firebase/auth";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { auth } from "@/shared/services/firebase/firebase";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";
import { requestNotificationPermission, sendNotification } from "@/shared/services/notifications/notification";
import { apiUrl } from "@/shared/config/api";
import { formatLocalDate, getTodayString } from "@/shared/utils/date";
import Header from "@/shared/components/layout/Header";
import Sidebar from "@/shared/components/layout/Sidebar";
import useTodoStore from "../store/todoStore";
import TodoCalendarPanel from "../components/TodoCalendarPanel";
import TodoComposer from "../components/TodoComposer";
import TodoFilterControls from "../components/TodoFilterControls";
import TodoList from "../components/TodoList";
import TodoProgressPanel from "../components/TodoProgressPanel";
import "./MainPage.css";
import { ROUTES } from "@/shared/constants/app";

function MainPage() {
  const { t, lang } = useLanguage();
  const { todos, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();

  const [newText, setNewText] = useState("");
  const [category, setCategory] = useState("근무");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dueDate, setDueDate] = useState(getTodayString);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeStartDate, setActiveStartDate] = useState(() => new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("전체");
  const [showAllTodos, setShowAllTodos] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const calendarRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "친구");

  useEffect(() => {
    if (!userId || userId === "undefined") window.location.href = ROUTES.login;
  }, [userId]);

  useEffect(() => {
    const fetchRealName = async () => {
      try {
        const response = await fetch(apiUrl(`/users/${encodeURIComponent(userId)}`), {
          headers: await getFirebaseAuthHeaders(),
        });
        const result = await response.json();
        if (result.success && result.user?.name) {
          setUserName(result.user.name);
          localStorage.setItem("userName", result.user.name);
        }
      } catch (requestError) {
        console.log(requestError);
      }
    };

    if (userId && userId !== "undefined") fetchRealName();
  }, [userId]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (userId && userId !== "undefined") fetchTodos(userId);
  }, [userId, fetchTodos]);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (!newText.trim()) return;

    const todoData = { userId, text: newText.trim(), category, dueDate };
    const result = await addTodo(todoData);
    if (!result?.success) return;

    setNewText("");
    setSearchTerm("");
    setFilterCategory("전체");
    setShowAllTodos(false);
    sendNotification("할 일이 추가되었습니다.", `[${category}] ${todoData.text}`);
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo._id, { completed: !todo.completed }, userId);
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    await updateTodo(id, { text: editText }, userId);
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id, userId);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      window.location.href = ROUTES.login;
    }
  };

  const handleDateChange = (date) => {
    setShowAllTodos(false);
    setSelectedDate(date);
    setDueDate(formatLocalDate(date));
  };

  const handleResetToToday = () => {
    const today = new Date();
    setShowAllTodos(false);
    setSelectedDate(today);
    setActiveStartDate(today);
    setDueDate(getTodayString());
  };

  const handleShowToday = () => handleResetToToday();

  const formattedSelectedDate = formatLocalDate(selectedDate);
  const selectedDayTodos = showAllTodos
    ? todos
    : todos.filter((todo) => todo.dueDate === formattedSelectedDate);
  const totalCount = selectedDayTodos.length;
  const completedCount = selectedDayTodos.filter((todo) => Boolean(todo.completed)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted100 = totalCount > 0 && progressPercent === 100;

  useEffect(() => {
    if (isCompleted100) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [isCompleted100]);
  const filteredTodos = selectedDayTodos.filter((todo) => {
    const legacyCategoryAliases = { 근무: ["업무"], 기타: ["개인"] };
    const matchesCategory = filterCategory === "전체" || todo.category === filterCategory || legacyCategoryAliases[filterCategory]?.includes(todo.category);
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay() + index);
    return date;
  });
  const dateHeading = new Intl.DateTimeFormat(lang, { dateStyle: "full" }).format(selectedDate);


  return (
    <div className="main-page">
      <Header
        userName={userName}
        toggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        onShowToday={handleShowToday}
        onShowAllTodos={() => setShowAllTodos(true)}
        onScrollToCalendar={() => calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        showAllTodos={showAllTodos}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        onShowAllTodos={() => setShowAllTodos(true)}
      />

      <main className="main-container">
        <div className="content-wrapper">
          <section className="welcome-section">
            <div>
              <p className="welcome-date">{dateHeading}</p>
              <h1 className="welcome-title">{t.welcomeGreeting.replace("{name}", userName)}</h1>
              <p className="welcome-subtitle">{t.appSubtitle}</p>
            </div>
            <button type="button" onClick={handleShowToday} className="today-btn">
              <span aria-hidden="true">↗</span>{t.btnToday}
            </button>
          </section>

          <TodoProgressPanel
            isCompleted100={isCompleted100}
            congratsLabel={t.statsCongrats}
            dateLabel={formattedSelectedDate}
            targetRateLabel={t.statsTargetRate}
            completedCount={completedCount}
            totalCount={totalCount}
            doneLabel={t.statsDone}
            progressPercent={progressPercent}
          />

          <TodoComposer
            dueDate={dueDate}
            category={category}
            onCategoryChange={setCategory}
            text={newText}
            onTextChange={setNewText}
            onSubmit={handleAddTodo}
            translations={t}
          />
          {error ? <p role="alert" className="todo-error">{error}</p> : null}

          <div className="dashboard-board">
            <section className="task-panel" aria-label={t.navTodos}>
              <div className="task-panel-heading">
                <div>
                  <p className="panel-eyebrow">{showAllTodos ? t.navTodos : dateHeading}</p>
                  <h2>{showAllTodos ? t.navTodos : t.searchResultTitle}</h2>
                </div>
                <span className="task-count">{filteredTodos.length}{t.statsCountSuffix}</span>
              </div>

              <div className="week-strip" role="group" aria-label={t.navCalendar}>
                {weekDays.map((date) => {
                  const isSelected = !showAllTodos && formatLocalDate(date) === formattedSelectedDate;
                  return (
                    <button
                      key={formatLocalDate(date)}
                      type="button"
                      className={`week-day ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setShowAllTodos(false);
                        setSelectedDate(date);
                        setActiveStartDate(date);
                        setDueDate(formatLocalDate(date));
                      }}
                      aria-pressed={isSelected}
                    >
                      <span>{new Intl.DateTimeFormat(lang, { weekday: "short" }).format(date)}</span>
                      <strong>{date.getDate()}</strong>
                    </button>
                  );
                })}
              </div>

              <TodoFilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterCategory={filterCategory}
                onFilterChange={setFilterCategory}
                translations={t}
              />
              <TodoList
                filteredTodos={filteredTodos}
                editingId={editingId}
                setEditingId={setEditingId}
                editText={editText}
                setEditText={setEditText}
                handleToggleComplete={handleToggleComplete}
                handleStartEdit={handleStartEdit}
                handleSaveEdit={handleSaveEdit}
                handleDeleteTodo={handleDeleteTodo}
              />
            </section>

            <aside className="calendar-column" ref={calendarRef}>
              <section className="calendar-card">
                <div className="calendar-card-heading">
                  <p className="panel-eyebrow">{t.targetDate}</p>
                  <h2>{t.navCalendar}</h2>
                </div>
                <TodoCalendarPanel
                  selectedDate={selectedDate}
                  activeStartDate={activeStartDate}
                  onDateChange={handleDateChange}
                  onActiveStartDateChange={setActiveStartDate}
                  onResetToday={handleShowToday}
                  todayLabel={t.btnToday}
                  locale={lang}
                />
              </section>
              <div className="calendar-summary">
                <span className="summary-icon" aria-hidden="true">✳</span>
                <div>
                  <strong>{formattedSelectedDate}</strong>
                  <p>{completedCount} / {totalCount} {t.statsDone}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;





