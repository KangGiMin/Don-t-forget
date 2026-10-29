# 네이버·카카오 소셜 로그인 설정

소셜 로그인은 제공자 인증 코드를 서버에서 교환하고, 서버가 발급한 Firebase 커스텀 토큰으로 앱 세션을 만듭니다. 제공자 비밀키와 Firebase 서비스 계정 개인키는 서버 환경변수에만 저장하세요. 웹이나 모바일 앱 환경변수에 넣으면 안 됩니다.

## 서버 환경변수

`dont-forget-server/.env.example`의 소셜 로그인 항목을 서버 `.env` 또는 배포 환경 변수에 설정합니다.

- `SOCIAL_AUTH_PUBLIC_URL`: 외부에서 접근 가능한 API의 HTTPS 기본 URL
- `SOCIAL_WEB_RETURN_URL`: 웹 로그인 화면의 HTTPS URL
- `SOCIAL_MOBILE_EXPO_HOSTS`: Expo Go redirect에 허용할 개발 호스트/IP 목록(쉼표 구분)
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `NAVER_CALLBACK_URL`
- `KAKAO_REST_API_KEY`, `KAKAO_CALLBACK_URL` (`KAKAO_CLIENT_SECRET`는 콘솔에서 사용 설정했다면 입력)
- `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_EMAIL`, `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY`

Firebase 서비스 계정은 Admin SDK 서비스 계정의 이메일과 개인 키를 사용합니다. 개인 키의 줄바꿈은 `.env`에서 `\n`으로 입력할 수 있습니다.

## 네이버 개발자 센터

네이버 로그인 애플리케이션을 만들고 로그인 사용자를 등록하세요. 서비스 URL에는 실제 웹 도메인을 등록하고, Callback URL에는 아래 값을 등록합니다.

`https://<공개 API 도메인>/api/auth/social/naver/callback`

필요한 프로필 항목(이름/닉네임/프로필 이미지)을 애플리케이션에서 제공하도록 설정하세요.

## 카카오 개발자 콘솔

카카오 로그인 사용 설정을 켜고 Redirect URI에 아래 값을 등록합니다.

`https://<공개 API 도메인>/api/auth/social/kakao/callback`

동의항목에서 닉네임 및 프로필 사진을 설정하고, 현재 앱은 닉네임과 프로필 이미지 동의 항목만 요청합니다. 카카오 Client Secret 기능을 켰다면 `KAKAO_CLIENT_SECRET`도 설정해야 합니다.

## 웹 설정

`SOCIAL_WEB_RETURN_URL`을 웹의 로그인 경로로 설정합니다. 기본값은 로컬 개발 주소 `http://localhost:5173/login`이며, 배포에서는 실제 HTTPS 주소가 필요합니다. 웹 프로젝트의 `.env`에는 `VITE_API_URL=https://<공개 API 도메인>/api`를 설정하세요. OAuth 시작 요청과 공급자 callback이 같은 API 호스트를 거쳐야 로그인 상태 쿠키가 유지됩니다.
## 모바일 설정 및 테스트

Expo Go 로컬 개발은 실제 기기에서 접속할 수 있는 API 주소가 필요합니다. 외부 OAuth callback까지 연결하려면 모바일 앱의 `EXPO_PUBLIC_API_URL`도 `https://<공개 API 도메인>/api`로 설정하고, HTTPS 터널이 개발 PC의 서버로 전달되도록 구성하세요. 평소 API 호출만을 위한 LAN 주소로 두면 OAuth 시작과 callback의 API 호스트가 달라져 상태 쿠키 검증이 실패합니다. 서버의 `SOCIAL_MOBILE_EXPO_HOSTS`에는 Expo Go redirect URI에 들어가는 Metro 호스트 이름/IP를 정확히 등록합니다(예: `192.168.0.28`). Expo Go redirect URI 경로는 `/--/social-auth`를 사용합니다. 독립 앱은 `dontforgetmobile://social-auth` 딥링크를 사용합니다.

OAuth 공급자 콘솔은 공개 HTTPS 콜백을 요구하므로 로컬 API만으로는 실제 네이버/카카오 승인을 완료할 수 없습니다. 개발 중에는 HTTPS 터널이나 배포 서버를 사용하고, 그 공개 URL을 위 콜백으로 동일하게 등록하세요.

설정 후 서버를 재시작하고 웹/앱 로그인 화면에서 각 버튼을 눌러 실제 공급자 인증과 Firebase 세션 생성까지 확인합니다. 이 저장소에는 실제 OAuth 키나 서비스 계정 키를 커밋하지 마세요.