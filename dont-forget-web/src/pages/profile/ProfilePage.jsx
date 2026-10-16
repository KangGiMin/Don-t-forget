import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../locales/LanguageContext';
import api from '../../api/client';
import './ProfilePage.css';

const DEFAULT_PROFILE_IMAGE =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem('userName') || '친구');
  const [statusMessage, setStatusMessage] = useState(
    localStorage.getItem('statusMessage') || '오늘 할 일을 내일로 미루지 말자!'
  );
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem('profileImg') || DEFAULT_PROFILE_IMAGE
  );
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const [{ data: profileData }, { data: todoData }] = await Promise.all([
          api.get('/users/me'),
          api.get('/todos'),
        ]);
        if (!active) return;

        const profile = profileData.user;
        setNickname(profile.name || '친구');
        setStatusMessage(profile.statusMessage || '');
        setProfileImg(profile.profileImg || DEFAULT_PROFILE_IMAGE);
        setCompletedCount(todoData.todos.filter((todo) => todo.completed).length);
      } catch (error) {
        console.error('프로필 데이터 조회 실패:', error);
        alert(error.message || '프로필 정보를 불러오지 못했습니다.');
      }
    };

    loadProfile();
    return () => { active = false; };
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await api.patch('/users/me', {
        name: nickname,
        statusMessage,
        profileImg,
      });
      setNickname(data.user.name);
      setStatusMessage(data.user.statusMessage);
      setProfileImg(data.user.profileImg || DEFAULT_PROFILE_IMAGE);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('statusMessage', data.user.statusMessage);
      localStorage.setItem('profileImg', data.user.profileImg || DEFAULT_PROFILE_IMAGE);
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert(error.message || '프로필을 저장하지 못했습니다.');
    }
  };

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_400_000) {
      alert('프로필 이미지는 1.4MB 이하의 파일을 선택해 주세요.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
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
          <img
            src={profileImg}
            alt="내 프로필"
            className={`profile-image ${isEditing ? 'editable' : ''}`}
            onClick={handleImageClick}
          />
          {isEditing && <div className="img-edit-hint">{t.txtProfilePicHint}</div>}
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
                onChange={(event) => setNickname(event.target.value)}
                placeholder={t.phNewNickname}
                maxLength={80}
              />
              <input
                type="text"
                className="edit-input status-input"
                value={statusMessage}
                onChange={(event) => setStatusMessage(event.target.value)}
                placeholder={t.phStatusMessage}
                maxLength={240}
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
