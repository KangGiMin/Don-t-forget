// src/pages/ContactAdminPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

function ContactAdminPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. 메모장에서 내 프로필 사진이랑 닉네임 꺼내오기!
  const userName = localStorage.getItem('userName') || '친구';
  const profileImg = localStorage.getItem('profileImg') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  // 2. 제목과 내용을 담을 스케치북 준비
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 3. 접수 버튼을 눌렀을 때 실행되는 녀석 (진짜 통신 버전!)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 빈칸 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요!");
      return;
    }

    try {
      // 서버의 우체국 창구(/api/contact)로 팩스 보내기!
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userName: userName, 
          title: title, 
          content: content 
        }),
      });

      const result = await response.json(); // 서버의 답장 해독

      // 서버가 성공적으로 메일을 보냈다면?
      if (result.success) {
        alert(result.message); // 🌟 "문의가 정상적으로 접수되었습니다!" 팝업 띄우기
        navigate(-1); // 메인 화면으로 돌아가기
      } else {
        alert("앗! 접수 실패: " + result.message);
      }
    } catch (error) {
      console.log("문의 접수 통신 에러 ㅠㅠ", error);
      alert("서버와 통신이 끊어졌습니다!");
    }
  };
  
  // 🌟 (여기에 허공에 떠 있던 옛날 코드 싹 다 밀어버렸어!)

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
          placeholder={t.phContactTitle}
          style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#334155', color: 'white', fontSize: '16px' }}
        />
        
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
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