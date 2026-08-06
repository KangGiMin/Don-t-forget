import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null); 

  // 📝 1. 내 정보 스케치북들
  const [isEditing, setIsEditing] = useState(false); 
  const [nickname, setNickname] = useState(localStorage.getItem('userName') || '친구');
  const [statusMessage, setStatusMessage] = useState(localStorage.getItem('statusMessage') || '오늘 할 일을 내일로 미루지 말자!');
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImg') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  
  // 🌟 2. 가짜 128개는 버리고 0개부터 시작하는 진짜 스케치북 준비!
  const [completedCount, setCompletedCount] = useState(0); 

  // 🔑 3. 서버(창고) 문을 열기 위한 신분증과 열쇠 준비!
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // 📡 4. 프로필 페이지에 들어오자마자 자동으로 실행되는 통계 마법!
  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        // 서버한테 "내 할 일 목록 싹 다 가져와!" 하고 요청 (열쇠 token도 같이 줌)
        const response = await fetch(`http://localhost:3000/api/todos/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json(); // 서버가 준 대답을 해독!

        if (result.success) {
          // 🌟 여기가 핵심! 전체 할 일(result.todos) 중에서 
          // 완료된 녀석(todo.completed === true)만 체로 걸러내서 개수(length)를 세어라!
          const realCompletedCount = result.todos.filter(todo => todo.completed === true).length;
          
          // 그 진짜 개수를 화면(스케치북)에 딱! 적어줌
          setCompletedCount(realCompletedCount);
        }
      } catch (error) {
        console.log('통계 불러오기 실패 ㅠㅠ', error);
      }
    };

    // 내 신분증(userId)이랑 열쇠(token)가 있을 때만 서버에 물어보기!
    if (userId && userId !== 'undefined' && token) {
      fetchCompletedTodos();
    }
  }, [userId, token]); // 이 마법은 신분증이나 열쇠가 바뀔 때(처음 들어왔을 때) 딱 실행됨!

  // 💾 저장 버튼
// 💾 3. '저장' 버튼을 눌렀을 때 실행되는 녀석 (진짜 서버에 보고하기!)
  const handleSave = async () => {
    try {
      // 1. 서버(창고)한테 "내 프로필 정보 좀 수정해 줘!" 하고 요청(PUT) 보내기!
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT', // 정보를 '수정'할 때는 무조건 PUT을 써!
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 내 신분증(열쇠) 챙기기!
        },
        body: JSON.stringify({
          userName: nickname,
          statusMessage: statusMessage,
          profileImg: profileImg
        }),
      });

      const result = await response.json(); // 서버의 대답 해독!

      if (result.success) {
        // 2. 서버 쪽 장부 수정이 완벽하게 끝났다면, 내 모니터 포스트잇(로컬스토리지)도 바꿔치기!
        localStorage.setItem('userName', nickname); 
        localStorage.setItem('statusMessage', statusMessage); 
        localStorage.setItem('profileImg', profileImg); 
        
        setIsEditing(false); // 수정 모드 끄기!
        alert('프로필이 완벽하게 저장됐어! 🎉');
      } else {
        alert('앗! 저장 실패: ' + result.message);
      }
    } catch (error) {
      console.log('프로필 업데이트 에러 ㅠㅠ', error);
      alert('서버랑 통신이 끊어졌어! ㅠㅠ');
    }
  };

  // 📸 프사 클릭
  const handleImageClick = () => {
    if (isEditing) { 
      fileInputRef.current.click(); 
    }
  };

  // 🖼️ 사진 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => {
        setProfileImg(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>⬅ 뒤로</button>
          
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>저장</button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>편집</button>
          )}
        </div>

        <div className="profile-img-section">
          <img 
            src={profileImg} 
            alt="내 프로필" 
            className={`profile-image ${isEditing ? 'editable' : ''}`} 
            onClick={handleImageClick}
          />
          {isEditing && <div className="img-edit-hint">프로필 사진을 클릭하면 변경할 수 있습니다</div>}
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </div>

        <div className="profile-info-section">
          {isEditing ? (
            <>
              <input 
                type="text" 
                className="edit-input nickname-input" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                placeholder="새로운 닉네임을 입력해!"
              />
              <input 
                type="text" 
                className="edit-input status-input" 
                value={statusMessage} 
                onChange={(e) => setStatusMessage(e.target.value)} 
                placeholder="상태 메시지를 적어봐!"
              />
            </>
          ) : (
            <>
              <h2 className="profile-nickname">{nickname}</h2>
              <p className="profile-status">"{statusMessage}"</p>
            </>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>🔥 지금까지 완료해 온 할 일</h3>
            {/* 🌟 이제 128이 아니라, 서버에서 세어 온 진짜 숫자가 여기 들어감! */}
            <span className="stat-number">{completedCount}개</span>
            <p>엄청난데? 완전 성실해! 👍</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;