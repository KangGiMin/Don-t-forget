// 모든 페이지 언어 원 클릭 변환

import React, { createContext, useState, useContext } from 'react';
import { dict } from './translations';

// 1. 빈 방송국(Context) 만들기
const LanguageContext = createContext();

// 2. 방송국에서 전파를 쏴주는 송신탑 역할 (Provider)
export const LanguageProvider = ({ children }) => {
  // 사용자가 마지막으로 고른 언어 기억하기 (기본은 한국어 'ko')
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'ko');
  
  // 현재 언어에 맞는 단어장(사전) 꺼내기
  const t = dict[lang] || dict['ko'];

  // 리모컨: 언어를 바꾸고 메모장에 저장하는 기능!
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
  };

  // 앱 전체(children)에 현재 언어, 번역가(t), 리모컨을 쫙 뿌려줌!
  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. 각 페이지에서 쉽게 전파를 잡아쓰기 위한 무전기!
export const useLanguage = () => useContext(LanguageContext);