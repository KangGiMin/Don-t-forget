// src/pages/MainPage.jsx
import { useLanguage } from '../LanguageContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import confetti from 'canvas-confetti'; 
import ThemeSelector from './ThemeSelector';
import './MainPage.css';

function MainPage() {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('업무'); // DB 저장용은 한글 유지!
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
  const [filterCategory, setFilterCategory] = useState('전체'); // 필터용
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '친구');

  useEffect(() => {
    if (!userId || userId === 'undefined' || !token) {
      window.location.href = '/login';
    }
  }, [userId, token]);

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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) setTodos(result.todos);
      } catch (error) { console.log(error); }
    };
    if (userId && userId !== 'undefined' && token) fetchTodos();
  }, [userId, token]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, text: newText, category, dueDate }),
      });
      const result = await response.json();
      if (result.success) {
        setNewText('');
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) { console.log(error); }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const result = await response.json();
      if (result.success) {
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) { console.log(error); }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: editText }),
      });
      const result = await response.json();
      if (result.success) {
        setEditingId(null);
        setEditText('');
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) { console.log(error); }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) { console.log(error); }
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

  // 카테고리 필터용 탭 리스트
  const filterTabs = [
    { key: '전체', label: t.catAll },
    { key: '업무', label: t.catWorkTxt },
    { key: '공부', label: t.catStudyTxt },
    { key: '개인', label: t.catPersonalTxt },
    { key: '기타', label: t.catOtherTxt },
  ];

  return (
    <div className="main-page">
      <div className="header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <div>

          {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

          <h1 className="title-text">{userName}{t.appTitle}</h1>
          <p className="subtitle-text">{t.appSubtitle}</p>
        </div>
        <button className="hamburger-button" onClick={toggleSidebar} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/profile')}>{t.menuProfile}</div>
          <div className="menu-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ marginBottom: '10px' }}>{t.menuLang}</span>
            <select value={lang} onChange={(e) => changeLanguage(e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '5px' }}>
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 English</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="th">🇹🇭 ไทย</option>
            </select>
          </div>
          <div className="menu-item" onClick={() => navigate('/contact')}>
           {t.menuContact}</div>
          <div className="menu-item">{t.menuAllTodos}</div>
          <div className="menu-item">{t.menuTime}</div>
          <div className="menu-item theme-menu-item"><span>{t.menuTheme}</span> <ThemeSelector /></div>
          <div className="menu-item logout-btn-sidebar" onClick={handleLogout}>{t.menuLogout}</div>
        </div>
        <div className="app-version">{t.appVersion} v1.0.0</div>
      </div>

      <div className="main-container">
        <div className="content-wrapper">
          <div className="calendar-section">
            <div className="today-btn-wrapper">
              <button onClick={handleResetToToday} className="today-btn">{t.btnToday}</button>
            </div>
            <div className="calendar-wrapper">
              {/* 🌟 달력 언어도 시스템 설정에 맞춰서 바뀌게 locale 추가! */}
              <Calendar onChange={handleDateChange} value={selectedDate} activeStartDate={activeStartDate} onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)} formatDay={(locale, date) => date.getDate()} locale={lang} />
            </div>
          </div>

          <div className={`stats-container ${isCompleted100 ? 'completed-100' : ''}`}>
            <div className="stats-info">
              {isCompleted100 ? (
                <span className="congrats-text">{t.statsCongrats}</span>
              ) : (
                <span>📌 {formattedSelectedDate} {t.statsTargetRate} ({completedCount}/{totalCount} {t.statsDone})</span>
              )}
              <span className="stats-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className={`progress-bar-fill ${isCompleted100 ? 'completed-100' : ''}`} style={{ width: `${progressPercent}%` }}></div>
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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
            {filterTabs.map((tab) => (
              <button key={tab.key} onClick={() => setFilterCategory(tab.key)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: filterCategory === tab.key ? '#38bdf8' : '#1e293b', color: filterCategory === tab.key ? '#0f172a' : '#94a3b8', transition: 'all 0.2s' }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="todo-list-container">
            <h3 className="section-title">{t.searchResultTitle} ({filteredTodos.length}{t.statsCountSuffix})</h3>
            {filteredTodos.length === 0 ? (
              <div className="empty-view">
                <p style={{ fontSize: '16px', margin: '0 0 6px 0' }}>{t.emptySearch1}</p>
                <p style={{ fontSize: '13px', margin: 0 }}>{t.emptySearch2}</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo._id} className="todo-item">
                  <div className="todo-content-wrapper">
                    <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo)} className="todo-checkbox" />
                    {editingId === todo._id ? (
                      <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="edit-input" autoFocus />
                    ) : (
                      <div className="todo-text-area">
                        <span className={`todo-text ${todo.completed ? 'completed' : 'active'}`}>{todo.text}</span>
                        <span className="todo-category-badge">
                          {/* DB에 저장된 한국어 키값을 가져와서 사전에 맞게 출력 */}
                          {todo.category === '업무' ? t.catWorkTxt : todo.category === '공부' ? t.catStudyTxt : todo.category === '개인' ? t.catPersonalTxt : todo.category === '기타' ? t.catOtherTxt : todo.category}
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
        </div>
      </div>
    </div>
  );
}

export default MainPage;