// src/pages/ContactAdminPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../../locales/LanguageContext";
import api from '../../api/client';

function ContactAdminPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || '친구';
  const profileImg = localStorage.getItem('profileImg') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요!");
      return;
    }

    try {
      const { data } = await api.post('/contact', {
        title: title.trim(),
        content: content.trim(),
      });

      if (!data.success) {
        throw new Error(data.message || '문의 접수에 실패했습니다.');
      }
      alert(data.message);
      navigate(-1);
    } catch (error) {
      console.log("문의 접수 통신 에러", error);
      alert(error.message || "서버와 통신이 끊어졌습니다");
    }
  };

  return (
    <div style={{ padding: '20px', color: '#f8fafc', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      
      {/* 뒤로 가기 버튼 & 타이틀 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: '15px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: 'white' }}>
          {t.btnBack || "⬅ 뒤로"}
        </button>
        <h1 style={{ margin: 0, fontSize: '24px' }}>{t.contactTitle}</h1>
      </div>

      {/* 🌟 유저 프로필 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '15px' }}>
        <img 
          src={profileImg} 
          alt="profile" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }} 
        />
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{userName}</div>
      </div>

      {/* 문의 입력 폼 영역 */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder={t.phContactTitle}
          style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#334155', color: 'white', fontSize: '16px' }}
        />
        
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={10000}
          placeholder={t.phContactContent}
          style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#334155', color: 'white', fontSize: '16px', minHeight: '200px', resize: 'vertical' }}
        />

        <button 
          type="submit" 
          style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          {t.btnSubmitContact}
        </button>
      </form>
      
     </div>
  );
}

export default ContactAdminPage;