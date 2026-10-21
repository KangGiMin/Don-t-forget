# Don't Forget Web

React 18 and Vite client for the Don't Forget personal todo app.

## Source layout

- `src/app/`: application routes and providers.
- `src/features/auth/`: login, signup, and account recovery screens.
- `src/features/todos/`: main todo page, calendar/progress/composer/filter/list components, API, and Zustand state.
- `src/features/profile/`: profile page and display/edit components.
- `src/features/admin/`: contact page, form, profile card, and header components.
- `src/features/preferences/`: theme selector.
- `src/shared/`: layout, Firebase auth, API URL configuration, translations, constants, date helpers, and global styles.
- `examples/`: unused starter assets preserved outside the application source.

The `@/` import alias points to `src/`. API requests use `VITE_API_URL`, defaulting to `http://localhost:3000/api`.

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates a production bundle.
- `npm run preview` serves the production bundle locally.

Configure the Firebase web app values in `.env` with the `VITE_FIREBASE_*` prefix before signing in.
