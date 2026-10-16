# 📝 돈폴겟 (Don't Forget)  
<br>

> **돈폴겟(Don't Forget)** 은 어떠한 사용자든 한 눈에 보고 다루기 편한 직관적이고 깔끔한 화면(UI)과 사용자의 다양한 경험(UX), 그리고 다양한 글로벌 환경을 고려한 **풀스택 투두리스트 웹 애플리케이션**입니다.
> <br>
> <br>
> 단순한 할 일 메모를 넘어, 캘린더 기반의 일정 관리, 달성률 통계, 최대 8개 국어 전환 기능까지 지원하여 수많은 사용자들이 언제 어디서나 최적의 환경에서 하루하루 소중한 일정을 관리할 수 있도록 설계되었습니다.

<br>
<br>
상태: 작업 중
<br>
<br>

## 👨‍💻 개발자 정보  
<br>

* 성명: **강기민**
* **Email:** gimingng2311@gmail.com
* **GitHub:** [https://github.com/KangGiMin](https://github.com/KangGiMin)

<br/>

## 🔥 기술 스택
<br>

#### 개발환경
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
[![Android Studio](https://img.shields.io/badge/Android%20Studio-000000?style=for-the-badge&logo=android-studio&logoColor=3DDC84)](https://developer.android.com/studio)


<br>

#### 운영체제
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)
[![Android Studio](https://img.shields.io/badge/Android%20-000000?style=for-the-badge&logo=android-studio&logoColor=3DDC84)](https://developer.android.com/studio)

<br>


#### 프론트엔드
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
<<<<<<< HEAD
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
=======
![React](https://img.shields.io/badge/react.js-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
>>>>>>> 263ed2a (commit)

<br>

#### 백엔드
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404D59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

<br>

#### 데이터베이스
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

<br>

#### 인증
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=FFCA28)

<br>

#### 배포
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

<br>

#### 빌드 
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

<br/>

## ✨ 주요 기능  

<br>

### 1. 사용자 인증 (Authentication)
* **Firebase Authentication:** 웹과 모바일에서 이메일/비밀번호로 계정을 만들고 로그인.
* **Google 로그인:** 웹 클라이언트에서 Google 계정으로 로그인.
* **서버 토큰 검증:** 백엔드가 Firebase ID 토큰을 검증하고 토큰 UID 기준으로 사용자 데이터를 격리.
* **비밀번호 재설정:** Firebase가 계정 이메일로 재설정 링크 발송.

<br>

### 2. 캘린더 기반 투두 리스트 (Todo Management)
* **CRUD 및 카테고리 필터링:** 할 일의 생성/조회/수정/삭제와 4가지 카테고리(업무, 공부, 개인, 기타) 제공.
* **날짜별 일정 연동:** `react-calendar`를 활용해 선택한 날짜의 할 일만 렌더링.
* **시각적 통계 피드백:** 당일 할 일 달성률(%)을 프로그레스 바(Progress Bar)로 제공하며, 100% 달성 시 `canvas-confetti` 폭죽 애니메이션 이벤트 발생.

<br>

### 3. 글로벌 및 사용자 편의성 극대화 (Global & UX)
* **Context API 기반 8개국어 다국어 지원:** 한국어, 영어, 일본어, 중국어, 독일어, 스페인어, 프랑스어, 태국어를 드롭다운 메뉴로 실시간 변환.
* **화면 테마 시스템:** 라이트 모드, 다크 모드 및 사용자의 OS 설정(`prefers-color-scheme`)을 실시간으로 감지하는 시스템 테마 자동화 적용.
* **사용자 프로필 관리:** 닉네임, 상태 메시지, 프로필 이미지 수정 가능.

<br>

### 4. 관리자에게 문의하기(Admin Email Contact)
* **Nodemailer 연동:** 사용자가 프론트엔드에서 문의 내용을 작성하면, 백엔드 API를 거쳐 관리자의 Gmail로 다이렉트 전송.

<br>

### 5. 모바일 앱 환경 구현 (Cross Platform) 
* **크로스 플랫폼 앱 환경 구축:** Expo Go(최신 SDK) 및 React Native 환경을 도입하여 웹의 핵심 로직과 시크한 흑화 다크모드 UI 감성을 모바일 화면으로 완벽 이식.

<<<<<<< HEAD
* **React Navigation 스택 라우팅:** @react-navigation/native-stack을 활용해 앱 실행 시 로그인 화면(LoginScreen)에서 메인 할 일 목록 화면(MainScreen)으로 부드럽게 전환되는 화면 이동 길목 구축.
=======
* **React Navigation 스택 라우팅:** @react-navigation/native-stack으로 인증 상태에 따라 로그인 또는 메인 할 일 화면 표시.
>>>>>>> 263ed2a (commit)

* **Zustand 구축 및 백엔드 통신 연동:** todoStore.js를 통해 서버 API(/api/todos)와 연동하여 모바일 환경에서도 할 일 데이터를 유기적으로 주고받을 수 있는 통신 고속도로 개통.

<br>

<<<<<<< HEAD
=======
## 🛠️ 로컬 실행 및 Firebase 설정

웹과 모바일은 동일한 Firebase 프로젝트를 사용하고, 서버는 Firebase Admin SDK의 Application Default Credentials를 통해 ID 토큰을 검증합니다.

1. Firebase Console에서 Email/Password 인증을 활성화합니다. 웹에서 Google 로그인을 쓸 경우 Google 제공업체도 활성화합니다.
2. `dont-forget-web/.env.example`을 `.env`로 복사하고 Firebase 웹 설정값과 API 주소를 입력합니다.
3. `dont-forget-web/dont-forget-mobile/.env.example`을 같은 폴더의 `.env`로 복사하고 같은 Firebase 프로젝트 설정값을 입력합니다. Android 에뮬레이터 기본 API 주소는 `10.0.2.2`를 사용합니다. 실기기는 PC의 LAN IP로 `EXPO_PUBLIC_API_URL`을 바꿔야 합니다.
4. `dont-forget-server/.env.example`을 `dont-forget-server/.env`로 복사하고 `MONGO_URI`, `FIREBASE_PROJECT_ID`, `CORS_ORIGIN`을 설정합니다. 로컬 Firebase Admin 인증은 Google Application Default Credentials 또는 `GOOGLE_APPLICATION_CREDENTIALS`에 지정한 서비스 계정 파일로 구성합니다. 서비스 계정 파일과 실제 `.env`는 저장소에 커밋하지 마세요.
5. 서버 폴더에서 `npm install` 후 `npm start`, 웹 폴더에서 `npm install` 후 `npm run dev`로 실행합니다. 모바일 폴더에서 `npm install` 후 `npx expo start`로 실행합니다.

현재 API의 모든 투두·프로필 요청은 `Authorization: Bearer <Firebase ID token>` 인증이 필요합니다. 서버는 요청에서 전달된 임의의 사용자 ID를 소유권 판단에 사용하지 않고, 검증된 토큰의 UID로 데이터를 조회하고 변경합니다.

이전 자체 로그인 계정은 Firebase 계정으로 자동 변환되지 않으며, 기존 `testUser` 투두도 특정 계정에 자동 귀속되지 않습니다. 이전 계정을 이전하려면 본인 확인과 계정 연결 절차가 별도로 필요합니다. 기존 MongoDB `users` 컬렉션의 평문 비밀번호 필드는 백업 및 이전 계획을 확인한 후 서버 폴더에서 `npm run scrub:legacy-passwords -- --apply`로 제거할 수 있습니다. 기본 실행은 삭제하지 않는 dry run입니다.

## 🌳 프로젝트 구조

<br>

```

├── .git
├── .vscode
│   └── settings.json
├── dont-forget-server
│   ├── .env
│   ├── app
│   │   └── App.css
│   ├── controllers
│   │   ├── todoController.js
│   │   └── userController.js
│   ├── models
│   │   ├── Todo.js
│   │   └── User.js
│   ├── node_modules
│   ├── routes
│   │   ├── todos.js
│   │   └── users.js
│   └── server.js
├── dont-forget-web
│   ├── .env
│   ├── .gitignore
│   ├── dont-forget-mobile
│   │   ├── .claude
│   │   │   └── settings.json
│   │   ├── .expo
│   │   │   ├── dev
│   │   │   │   └── logs
│   │   │   │       └── start.log
│   │   │   ├── devices.json
│   │   │   ├── README.md
│   │   │   └── settings.json
│   │   ├── .gitignore
│   │   ├── .vscode
│   │   │   ├── extensions.json
│   │   │   └── settings.json
│   │   ├── AGENTS.md
│   │   ├── App.js
│   │   ├── app.json
│   │   ├── assets
│   │   │   ├── expo.icon
│   │   │   │   ├── Assets
│   │   │   │   │   ├── expo-symbol 2.svg
│   │   │   │   │   └── grid.png
│   │   │   │   └── icon.json
│   │   │   └── images
│   │   │       ├── android-icon-background.png
│   │   │       ├── android-icon-foreground.png
│   │   │       ├── android-icon-monochrome.png
│   │   │       ├── expo-badge-white.png
│   │   │       ├── expo-badge.png
│   │   │       ├── expo-logo.png
│   │   │       ├── favicon.png
│   │   │       ├── icon.png
│   │   │       ├── logo-glow.png
│   │   │       ├── react-logo.png
│   │   │       ├── react-logo@2x.png
│   │   │       ├── react-logo@3x.png
│   │   │       ├── splash-icon.png
│   │   │       ├── tabIcons
│   │   │       │   ├── explore.png
│   │   │       │   ├── explore@2x.png
│   │   │       │   ├── explore@3x.png
│   │   │       │   ├── home.png
│   │   │       │   ├── home@2x.png
│   │   │       │   └── home@3x.png
│   │   │       └── tutorial-web.png
│   │   ├── CLAUDE.md
│   │   ├── LICENSE
│   │   ├── node_modules
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── screens
│   │   │   ├── LoginScreen.js
│   │   │   └── MainScreen.js
│   │   ├── scripts
│   │   │   └── reset-project.js
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── explore.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── _layout.tsx
│   │   │   ├── components
│   │   │   │   ├── animated-icon.module.css
│   │   │   │   ├── animated-icon.tsx
│   │   │   │   ├── animated-icon.web.tsx
│   │   │   │   ├── app-tabs.tsx
│   │   │   │   ├── app-tabs.web.tsx
│   │   │   │   ├── external-link.tsx
│   │   │   │   ├── hint-row.tsx
│   │   │   │   ├── themed-text.tsx
│   │   │   │   ├── themed-view.tsx
│   │   │   │   ├── ui
│   │   │   │   │   └── collapsible.tsx
│   │   │   │   └── web-badge.tsx
│   │   │   ├── constants
│   │   │   │   └── theme.ts
│   │   │   ├── global.css
│   │   │   └── hooks
│   │   │       ├── use-color-scheme.ts
│   │   │       ├── use-color-scheme.web.ts
│   │   │       └── use-theme.ts
│   │   ├── store
│   │   │   └── todoStore.js
│   │   └── tsconfig.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.png
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   └── todoApi.js
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── todo
│   │   │       └── TodoList.jsx
│   │   ├── firebase
│   │   │   └── firebase.js
│   │   ├── index.css
│   │   ├── locales
│   │   │   ├── LanguageContext.jsx
│   │   │   └── translations.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── admin
│   │   │   │   ├── ContactAdminPage.css
│   │   │   │   └── ContactAdminPage.jsx
│   │   │   ├── auth
│   │   │   │   ├── findid
│   │   │   │   │   ├── FindIdPage.css
│   │   │   │   │   └── FindIdPage.jsx
│   │   │   │   ├── findpw
│   │   │   │   │   ├── FindPwPage.css
│   │   │   │   │   └── FindPwPage.jsx
│   │   │   │   ├── login
│   │   │   │   │   ├── LoginPage.css
│   │   │   │   │   └── LoginPage.jsx
│   │   │   │   └── signup
│   │   │   │       ├── SignupPage.css
│   │   │   │       └── SignupPage.jsx
│   │   │   ├── main
│   │   │   │   ├── MainPage.css
│   │   │   │   └── MainPage.jsx
│   │   │   ├── profile
│   │   │   │   ├── ProfilePage.css
│   │   │   │   └── ProfilePage.jsx
│   │   │   └── theme
│   │   │       ├── ThemeSelector.css
│   │   │       └── ThemeSelector.jsx
│   │   ├── store
│   │   │   └── todoStore.js
│   │   └── utils
│   │       └── notification.js
│   └── vite.config.js
├── README.md
└── TroubleShooting.md

```
>>>>>>> 263ed2a (commit)
