// src/pages/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './ProfilePage.css';

function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [nickname, setNickname] = useState(localStorage.getItem('userName') || '친구');
  const [statusMessage, setStatusMessage] = useState(localStorage.getItem('statusMessage') || '오늘 할 일을 내일로 미루지 말자!');
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImg') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  const [completedCount, setCompletedCount] = useState(0); 
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/todos/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const result = await response.json(); 
        if (result.success) {
          const realCompletedCount = result.todos.filter(todo => todo.completed === true).length;
          setCompletedCount(realCompletedCount);
        }
      } catch (error) { console.log(error); }
    };
    if (userId && userId !== 'undefined' && token) fetchCompletedTodos();
  }, [userId, token]); 

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userName: nickname, statusMessage: statusMessage, profileImg: profileImg }),
      });
      const result = await response.json(); 
      if (result.success) {
        localStorage.setItem('userName', nickname); 
        localStorage.setItem('statusMessage', statusMessage); 
        localStorage.setItem('profileImg', profileImg); 
        setIsEditing(false); 
      }
    } catch (error) { console.log(error); }
  };

  const handleImageClick = () => { if (isEditing) fileInputRef.current.click(); };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => { setProfileImg(reader.result); };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>{t.btnBack}</button>
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>{t.btnSaveProfile}</button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>{t.btnEditProfile}</button>
          )}
        </div>

        <div className="profile-img-section">
          <img src={profileImg} alt="내 프로필" className={`profile-image ${isEditing ? 'editable' : ''}`} onClick={handleImageClick} />
          {isEditing && <div className="img-edit-hint">{t.txtProfilePicHint}</div>}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
        </div>

        <div className="profile-info-section">
          {isEditing ? (
            <>
              <input type="text" className="edit-input nickname-input" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={t.phNewNickname} />
              <input type="text" className="edit-input status-input" value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} placeholder={t.phStatusMessage} />
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
            <h3>{t.statsCompletedTitle}</h3>
            <span className="stat-number">{completedCount}{t.statsCountSuffix}</span>
            <p>{t.statsCheer}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
export default ProfilePage;