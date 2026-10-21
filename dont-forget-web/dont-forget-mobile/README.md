# Don't Forget Mobile

Expo SDK 57 and React Native client for the Don't Forget personal todo app.

## Features

- Firebase email/password login and signup with persistent native auth.
- Email-based password reset; ID lookup follows the server's privacy-safe disabled response.
- Todo create, edit, complete, delete, text search, category filters, and due dates.
- Profile name/status editing, profile photo selection, and completed-task count.
- Authenticated administrator contact form.

## Source layout

- `index.js`: Expo entry registered with `registerRootComponent`.
- `src/navigation`: React Navigation stack, switched by Firebase auth state.
- `src/features/auth`: sign-in, signup, ID notice, password-reset screens, and account API.
- `src/features/todos`: todo screens, composer/list components, API, and Zustand store.
- `src/features/profile`: profile screen and API.
- `src/features/admin`: contact screen and API.
- `src/services`: Firebase initialization and authenticated API client.
- `src/shared`: shared form controls and date helpers.

## Configuration and launch

Copy `.env.example` to `.env` and configure the Firebase values plus `EXPO_PUBLIC_API_URL`.
Start the API server before launching the app. On an Android emulator, the default API address
uses `10.0.2.2`. On a physical phone, set `EXPO_PUBLIC_API_URL` to the computer's reachable LAN
address, for example `http://192.168.0.10:3000/api`; `localhost` on the phone refers to the phone.
For Expo Go, keep the phone and development computer on the same network.

Run `npm install`, then `npm start`. Use `npm run android` for Android or `npm run ios` for iOS.
