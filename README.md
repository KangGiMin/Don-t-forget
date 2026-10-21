# Don't Forget

Don't Forget is a personal todo application with a React/Vite web client, an Express/MongoDB API, and an Expo/React Native mobile client. Firebase Authentication is the sign-in source for web and mobile API requests. Both clients send Firebase ID tokens in the Authorization Bearer header; the API associates records with the verified Firebase UID.

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
