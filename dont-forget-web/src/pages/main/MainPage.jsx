import { useLanguage } from "../../locales/LanguageContext";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import confetti from 'canvas-confetti'; 
import './MainPage.css';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import TodoList from '../../components/todo/TodoList'; 
import useTodoStore from '../../store/todoStore';
import { requestNotificationPermission, sendNotification } from '../../utils/notification';

function MainPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const { todos, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();

  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('업무'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDueDate] = useState(getTodayString());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('전체');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '친구');

  // 로그인 상태 체크
  useEffect(() => {
    if (!userId || userId === 'undefined' || !token) {
      window.location.href = '/login';
    }
  }, [userId, token]);

  // 이름 가져오기
  useEffect(() => {
    const fetchRealName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const result = await response.json();
        if (result.success && result.user && result.user.name) {
          setUserName(result.user.name); 
          localStorage.setItem('userName', result.user.name); 
        }
      } catch (error) { console.log(error); }
    };
    if (userId && userId !== 'undefined') fetchRealName();
  }, [userId]); 

  // 화면 켜지자마자 알림 권한 허락받기
useEffect(() => {
  requestNotificationPermission();
}, []);

  // 3. 할 일 불러오기
  useEffect(() => {
    if (userId && userId !== 'undefined' && token) {
      fetchTodos(userId, token);
    }
  }, [userId, token, fetchTodos]);

  // 4. 할 일 추가하기
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    
    const todoData = { userId, text: newText, category, dueDate };
    await addTodo(todoData, token); 
    setNewText(''); 
    sendNotification("새로운 할 일 등록 완료!", `[${category}] ${newText}`);
  };

  // 5. 할 일 완료 토글
  const handleToggleComplete = async (todo) => {
    await updateTodo(todo._id, { completed: !todo.completed }, userId, token);
  };

  // 6. 할 일 수정 시작
  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  // 7. 할 일 텍스트 수정 저장
  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    await updateTodo(id, { text: editText }, userId, token);
    setEditingId(null);
    setEditText('');
  };

  // 8. 할 일 삭제하기
  const handleDeleteTodo = async (id) => {
    await deleteTodo(id, userId, token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
    setDueDate(getTodayString());
  };

  const formattedSelectedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  
  // 창고에서 꺼내온 데이터(todos)를 필터링
  const selectedDayTodos = todos.filter(todo => todo.dueDate === formattedSelectedDate);

  const totalCount = selectedDayTodos.length;
  const completedCount = selectedDayTodos.filter(todo => Boolean(todo.completed)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted100 = totalCount > 0 && progressPercent === 100;

  useEffect(() => {
    if (isCompleted100) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [isCompleted100]);

  const filteredTodos = selectedDayTodos.filter(todo => {
    const matchesCategory = filterCategory === '전체' || todo.category === filterCategory;
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filterTabs = [
    { key: '전체', label: t.catAll },
    { key: '업무', label: t.catWorkTxt },
    { key: '공부', label: t.catStudyTxt },
    { key: '개인', label: t.catPersonalTxt },
    { key: '기타', label: t.catOtherTxt },
  ];

  return (
    <div className="main-page">
      <Header userName={userName} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} />
      
      <div className="main-container">
        <div className="content-wrapper">
          
          <div className="calendar-section">
            <div className="today-btn-wrapper">
              <button onClick={handleResetToToday} className="today-btn">{t.btnToday}</button>
            </div>
            <div className="calendar-wrapper">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                formatDay={(locale, date) => date.getDate()}
                locale={lang}
              />
            </div>
          </div>

          <div className={`stats-container ${isCompleted100 ? "completed-100" : ""}`}>
            <div className="stats-info">
              {isCompleted100 ? (
                <span className="congrats-text">{t.statsCongrats}</span>
              ) : (
                <span>📌 {formattedSelectedDate} {t.statsTargetRate} ({completedCount}/{totalCount} {t.statsDone})</span>
              )}
              <span className="stats-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className={`progress-bar-fill ${isCompleted100 ? "completed-100" : ""}`} style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="todo-form">
            <div className="form-top-row">
              <span className="selected-date-text">{t.targetDate} {dueDate}</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-box">
                <option value="업무">{t.catWork}</option>
                <option value="공부">{t.catStudy}</option>
                <option value="개인">{t.catPersonal}</option>
                <option value="기타">{t.catOther}</option>
              </select>
            </div>
            <div className="form-input-row">
              <input type="text" placeholder={t.phNewTodo} value={newText} onChange={(e) => setNewText(e.target.value)} className="text-input" />
              <button type="submit" className="submit-btn">{t.btnAdd}</button>
            </div>
          </form>

          <input type="text" placeholder={t.phSearch} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />

          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterCategory(tab.key)}
                style={{
                  padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "600",
                  backgroundColor: filterCategory === tab.key ? "#38bdf8" : "#1e293b",
                  color: filterCategory === tab.key ? "#0f172a" : "#94a3b8",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 🌟 쪼개놓은 TodoList 컴포넌트 렌더링! */}
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

        </div>
      </div>
    </div>
  );
}

export default MainPage;