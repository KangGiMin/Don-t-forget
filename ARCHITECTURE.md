# Project structure and where to edit things

This project is organized by product area first, then by the kind of work inside that area. Keep a screen's state and event wiring close to its screen, put a reusable visual unit in its own component folder, keep its styles beside that unit, and place server rules in services or validators instead of route handlers.

## Web client

```text
dont-forget-web/src/
├── app/                         # URL routes and app-wide setup
├── features/
│   ├── auth/pages/{login,signup,findid,findpw}/ # Auth page + page styles
│   ├── admin/pages/              # Contact page and its form/profile/header pieces
│   ├── profile/{pages,components}/# Profile page and profile sections
│   ├── preferences/components/    # Theme selector and its styles
│   ├── extras/pages/              # Routine, journal, leaderboard pages
│   └── todos/
│       ├── api/                   # Todo HTTP calls
│       ├── store/                 # Todo client state and store actions
│       ├── pages/                 # MainPage.jsx and MainPage.css import barrel
│       ├── components/
│       │   ├── calendar/          # Calendar panel + calendar styles
│       │   ├── composer/          # New todo/reminder form + styles
│       │   ├── date-strip/        # Week/date selector styles
│       │   ├── filters/           # Search/category filters + styles
│       │   ├── header/            # Main page header styles
│       │   ├── list/              # Todo list/items + styles
│       │   ├── progress/          # Progress card + styles
│       │   └── sidebar/           # Sidebar styles
│       └── styles/                # Page shell, welcome area, dashboard layout,
│                                  # responsive rules, and shared feedback styles
└── shared/                        # API config, i18n, Firebase, layout, theme, utilities
```

To change the main web page, open `features/todos/pages/MainPage.jsx`. Its stylesheet is a small import list; edit the named component stylesheet for the affected area. For example, the add-todo form lives in `components/composer/`, and the calendar lives in `components/calendar/`.

## Mobile client

```text
dont-forget-web/dont-forget-mobile/src/
├── navigation/                    # Screen registration and navigation
├── features/
│   ├── auth/{screens,components,api}/
│   ├── admin/{screens,api}/
│   ├── profile/{screens,api}/
│   ├── extras/screens/             # Routine, journal, leaderboard
│   └── todos/
│       ├── screens/                # Screen state and API event wiring
│       ├── components/
│       │   ├── composer/           # Todo entry form
│       │   ├── dashboard/          # Main page header and overview
│       │   ├── list/               # Todo list and row
│       │   └── modals/             # Edit, calendar, and settings dialogs
│       ├── styles/                 # Main screen styles grouped by UI area
│       │   └── modals/             # Shared, calendar, and settings styles
│       ├── store/                  # Todo state/actions and category constants
│       ├── api/                    # Todo HTTP calls
│       └── utils/                  # Todo calendar/date calculations
└── shared/                         # Theme, reusable form controls, and utilities
```

Start with `features/todos/screens/MainScreen.js` for interactions and `components/` for the visual element. The style entry point is `features/todos/styles/index.js`; individual style groups are in sibling files. Edit a modal's view in `components/modals/` and its colors/layout in `styles/modals/`.

## Server

```text
dont-forget-server/src/
├── app.js                          # Express middleware and route mounting
├── config/                         # Database connection
├── middleware/                     # Authentication and rate limits
├── services/                       # Cross-feature background jobs and push delivery
├── shared/                         # Shared date/time rules
└── features/
    ├── todos/
    │   ├── todoRoutes.js            # HTTP endpoint paths and middleware
    │   ├── todoController.js        # HTTP request/response handling
    │   ├── Todo.js                  # Todo schema
    │   └── services/                # Reminder/deadline rules and completion scoring
    ├── routines/
    │   ├── routineRoutes.js
    │   ├── routineController.js
    │   ├── Routine.js
    │   └── validators/              # Routine input and recurrence validation
    ├── users/
    │   ├── userRoutes.js
    │   ├── userController.js        # Exports feature controllers for existing routes
    │   ├── controllers/             # Authentication, profile, and contact endpoints
    │   ├── services/                # Password hashing and verification
    │   └── *.js                     # User and completion schemas
    ├── journals/                    # Journal endpoints and schema
    ├── leaderboard/                 # Ranking endpoints
    └── notifications/               # Push registration endpoints
```

For a server change, edit the route when the URL or middleware changes, a controller when an HTTP request/response changes, a validator for input rules, or a service for reusable business logic. `userController.js` stays as a small aggregator so the existing user routes keep their current connection.

## Naming convention for future additions

- One page or screen per route; put page-only composition in that page file.
- Give a self-contained UI area its own component file and same-named folder when it has styles, child components, or behavior worth finding independently.
- Put component styles next to their component. Avoid putting feature styles back into a page-wide stylesheet; use the page stylesheet only as an ordered import barrel.
- Keep event handlers and screen state in the page/screen or a feature hook; keep pure date/format calculations in `utils/`.
- Keep Express endpoints in controllers, request validation in `validators/`, and cross-handler business operations in `services/`.