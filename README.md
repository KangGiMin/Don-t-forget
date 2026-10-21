# Don't Forget

Don't Forget is a personal todo application with a React/Vite web client, an Express/MongoDB API, and an Expo/React Native mobile client. Firebase Authentication is the sign-in source for web and mobile API requests. Both clients send Firebase ID tokens in the Authorization Bearer header; the API associates records with the verified Firebase UID.

<<<<<<< HEAD
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

#### 운영체제
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![macOS](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

<br>


#### 프론트엔드
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JSX](https://img.shields.io/badge/JSX-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)

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
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
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

### 1. 강력한 사용자 인증 및 보안 (Auth & Security)
* **JWT 기반 로컬 로그인/회원가입:** 비밀번호 검증 및 만료 기간이 설정된 JWT 토큰 발급.
* **Firebase OAuth 소셜 로그인:** 구글 간편 로그인을 통한 사용자 접근성 향상.
* **계정 찾기:** 가입된 이름 기반 아이디 찾기 및 비밀번호 재설정 기능 제공.

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
=======
## Project structure

```text
.
├─ dont-forget-web/
│  ├─ src/
│  │  ├─ app/                         # Web routes and providers
│  │  ├─ features/
│  │  │  ├─ admin/                    # Contact page and subcomponents
│  │  │  ├─ auth/                     # Login, signup, account help pages
│  │  │  ├─ preferences/              # Theme controls
│  │  │  ├─ profile/                  # Profile page and subcomponents
│  │  │  └─ todos/                    # Todo page, UI, API, Zustand store
│  │  └─ shared/                      # Layout, config, Firebase, i18n, utilities
│  ├─ examples/                       # Preserved unused Vite starter assets
│  └─ dont-forget-mobile/
│     ├─ src/features/                # Auth and todo screens/components/store/API
│     ├─ src/navigation/               # React Navigation root
│     ├─ src/services/                 # Firebase and API configuration
│     └─ examples/                     # Preserved unused Expo Router starter
└─ dont-forget-server/
   ├─ src/config/                      # Database configuration
   ├─ src/features/                    # Todo and user routes/controllers/models
   └─ src/middleware/                  # Shared request middleware
```

The web client keeps its shared styling and existing route behavior while its page responsibilities are split into smaller feature components. The server stays on the same `/api` routes. The mobile client uses the React Navigation entry that is actually wired to the app; the unused generated Expo Router starter is kept under `examples/` and is not part of the app entry.

## Run the API

1. Open a terminal in `dont-forget-server`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env` and configure `MONGO_URI`, `JWT_SECRET` (at least 32 random bytes), and `FIREBASE_PROJECT_ID`. `PORT` and `DNS_SERVERS` are optional. Configure SMTP values to enable contact email.
4. Run `npm start`. The API listens on port 3000 unless `PORT` is set.

Generate a JWT secret with: `node -p "require('node:crypto').randomBytes(32).toString('base64url')"`

## Run the web app

1. Open a terminal in `dont-forget-web`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env` and fill in the Firebase web app settings (`VITE_FIREBASE_*`). Set `VITE_API_URL` only when the API is not at `http://localhost:3000/api`.
4. Run `npm run dev`.

## Run the mobile app

1. Open a terminal in `dont-forget-web/dont-forget-mobile`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`. Fill in the same Firebase web app settings with the `EXPO_PUBLIC_FIREBASE_*` names.
4. Set `EXPO_PUBLIC_API_URL` to an API address reachable from the device. On a physical phone, use the computer's LAN address; `localhost` refers to the phone itself.
5. Run `npm start` and open the project in Expo Go.

The mobile app uses Firebase email/password sign-in and shares the API's `_id`, `completed`, and `{ success, todos }` data shape.
>>>>>>> 43d5ec4 (모바일 앱(React Native) 환경 구현)
