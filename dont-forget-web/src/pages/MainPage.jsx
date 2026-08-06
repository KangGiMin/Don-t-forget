// src/pages/MainPage.jsx

import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import confetti from 'canvas-confetti'; 
import './MainPage.css';

function MainPage() {

  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('업무');
  
  // 🍔 사이드바 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
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

  // 🔍 검색어 및 카테고리 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('전체');

  // ✏️ 수정 중인 아이템 ID 및 텍스트 상태
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const userName = localStorage.getItem('userName') || '친구';
  const userId = localStorage.getItem('userId');
  // 🔑 저장된 JWT 인증 토큰 가져오기!
  const token = localStorage.getItem('token');

  // 🛡️ 로그인 방어막 (토큰이나 유저 정보가 없으면 로그인 페이지로 튕겨냄)
  useEffect(() => {
    if (!userId || userId === 'undefined' || !token) {
      alert('인증이 필요합니다. 다시 로그인해 주세요!');
      window.location.href = '/login';
    }
  }, [userId, token]);

  // 📋 할 일 목록 불러오기 (JWT 토큰 전달)
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (result.success) {
          setTodos(result.todos);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.log('할 일 불러오기 실패 ㅠㅠ', error);
      }
    };

    if (userId && userId !== 'undefined' && token) {
      fetchTodos();
    }
  }, [userId, token]);

  // ➕ 새로운 할 일 등록 (JWT 토큰 전달)
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          userId: userId,
          text: newText,
          category: category,
          dueDate: dueDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewText('');
        // 리프레시를 위해 다시 조회
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log('할 일 추가 에러 ㅠㅠ', error);
      alert('할 일 저장 실패 ㅠㅠ');
    }
  };

  // ✅ 완료 체크박스 토글 (JWT 토큰 전달)
  const handleToggleComplete = async (todo) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      const result = await response.json();
      if (result.success) {
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) {
      console.log('할 일 수정 에러 ㅠㅠ', error);
    }
  };

  // ✏️ 수정 시작
  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  // 💾 수정 내용 저장 (JWT 토큰 전달)
  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText }),
      });

      const result = await response.json();
      if (result.success) {
        setEditingId(null);
        setEditText('');
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log('할 일 텍스트 수정 에러 ㅠㅠ', error);
    }
  };

  // 🗑️ 삭제 버튼 (JWT 토큰 전달)
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        const res = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setTodos(data.todos);
      }
    } catch (error) {
      console.log('할 일 삭제 에러 ㅠㅠ', error);
    }
  };

  // 🚪 로그아웃 (토큰 및 사용자 정보 삭제)
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    window.location.href = '/login';
  };

  // 📅 날짜 선택
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`);
  };

  // 📅 오늘로 리셋
  const handleResetToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
    setDueDate(getTodayString());
  };

  // 📊 필터링 및 통계 계산
  const formattedSelectedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayTodos = todos.filter(todo => todo.dueDate === formattedSelectedDate);

  const totalCount = selectedDayTodos.length;
  const completedCount = selectedDayTodos.filter(todo => Boolean(todo.completed)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 🌟 100% 달성 상태
  const isCompleted100 = totalCount > 0 && progressPercent === 100;

  // 🎊 100% 달성 시 폭죽 팡팡 터뜨리기!
  useEffect(() => {
    if (isCompleted100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isCompleted100]);

  // 🔍 최종 카테고리/검색어 필터 목록
  const filteredTodos = selectedDayTodos.filter(todo => {
    const matchesCategory = filterCategory === '전체' || todo.category === filterCategory;
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // =====================================================================
  // 🌟 대망의 화면 렌더링 (거대한 쟁반 하나로 싹 다 합체!)
  // =====================================================================
  return (
    <div className="main-page">
      
      {/* 1. 상단 헤더 영역 (햄버거 버튼 추가) */}
      <div className="header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <div>
          <h1 className="title-text">{userName}님의 돈폴겟</h1>
          <p className="subtitle-text">"오늘 할 일을 내일로 미루지 말자."</p>
        </div>
        
        {/* 메뉴 버튼 */}
        
        <button 
          className="hamburger-button" 
          onClick={toggleSidebar} 
          style={{ 
            fontSize: '24px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            
          }}
        >
          ☰
        </button>
      </div>

     
     {/* 2. 오른쪽에서 스르륵 튀어나올 사이드바 구역 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        {/* 닫기 버튼 */}
        <button className="close-button" onClick={toggleSidebar}>✖</button>

        {/* 메뉴판 내용물 */}
      
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/profile')}>내 프로필</div>
          <div className="menu-item">시스템 언어</div>
          <div className="menu-item">관리자에게 문의하기</div>
          <div className="menu-item">모든 할 일 목록 보기</div>
          <div className="menu-item">시간을 24시간제로 표시</div>
          
          <div className="menu-item theme-menu-item">
            <span>🎨 화면 테마 </span> 
            <ThemeSelector />
          </div>
          
          {/* 로그아웃 버튼 */}
          <div className="menu-item logout-btn-sidebar" onClick={handleLogout}>
            🚪 로그아웃
          </div>
        </div>

        {/* 앱 버전 */}
        <div className="app-version">앱 버전: v1.0.0</div>
      </div>
      {/* 3. 메인 콘텐츠 영역 (달력, 통계, 투두리스트 등등) */}
      <div className="main-container">
        <div className="content-wrapper">
          
          {/* 캘린더 영역 */}
          <div className="calendar-section">
            <div className="today-btn-wrapper">
              <button onClick={handleResetToToday} className="today-btn">
                오늘
              </button>
            </div>
            <div className="calendar-wrapper">
              <Calendar 
                onChange={handleDateChange} 
                value={selectedDate} 
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                formatDay={(locale, date) => date.getDate()} 
              />
            </div>
          </div>

          {/* 📊 통계 게이지바 */}
          <div className={`stats-container ${isCompleted100 ? 'completed-100' : ''}`}>
            <div className="stats-info">
              {isCompleted100 ? (
                <span className="congrats-text">🎉 완벽해! 오늘 할 일 올킬 달성 완료! 🥳</span>
              ) : (
                <span>📌 {formattedSelectedDate} 달성률 ({completedCount}/{totalCount} 완료)</span>
              )}
              <span className="stats-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${isCompleted100 ? 'completed-100' : ''}`} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 할 일 입력 폼 */}
          <form onSubmit={handleAddTodo} className="todo-form">
            <div className="form-top-row">
              <span className="selected-date-text">🎯 선택한 날짜: {dueDate}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-box"
              >
                <option value="업무">💼 업무</option>
                <option value="공부">📚 공부</option>
                <option value="개인">🏃‍♂️ 개인</option>
                <option value="기타">✨ 기타</option>
              </select>
            </div>
            
            <div className="form-input-row">
              <input
                type="text"
                placeholder="이 날의 새로운 할 일을 입력하세요..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="text-input"
              />
              <button type="submit" className="submit-btn">
                추가
              </button>
            </div>
          </form>

          {/* 검색창 */}
          <input
            type="text"
            placeholder="🔍 이 날의 할 일 중 키워드로 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* 카테고리 필터 탭 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
            {['전체', '업무', '공부', '개인', '기타'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  backgroundColor: filterCategory === cat ? '#38bdf8' : '#1e293b',
                  color: filterCategory === cat ? '#0f172a' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 할 일 목록 리스트 */}
          <div className="todo-list-container">
            <h3 className="section-title">
              📋 검색 결과 및 일정 ({filteredTodos.length}개)
            </h3>
            
            {filteredTodos.length === 0 ? (
              <div className="empty-view">
                <p style={{ fontSize: '16px', margin: '0 0 6px 0' }}>조건에 맞는 일정이 없어! 🎉</p>
                <p style={{ fontSize: '13px', margin: 0 }}>검색어를 바꾸거나 새로운 일정을 추가해 봐.</p>
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
                        <span className={`todo-text ${todo.completed ? 'completed' : 'active'}`}>
                          {todo.text}
                        </span>
                        <span className="todo-category-badge">
                          {todo.category || '기본'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="button-group">
                    {editingId === todo._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(todo._id)} className="edit-btn">
                          저장
                        </button>
                        <button onClick={() => setEditingId(null)} className="delete-btn">
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(todo)} className="edit-btn">
                          수정
                        </button>
                        <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">
                          삭제
                        </button>
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