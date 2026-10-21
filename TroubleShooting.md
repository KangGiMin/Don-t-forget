# Troubleshooting

## API server does not start

- Use Node.js 20.19 or newer, enter dont-forget-server, run npm ci, and start with npm start.
- Ensure .env contains MONGO_URI, a JWT_SECRET of at least 32 random bytes, and FIREBASE_PROJECT_ID.
- If MongoDB Atlas rejects a connection, check the database user's permissions, URI encoding for special characters, and Atlas Network Access rules. Prefer allowing only the development or deployed server address instead of opening access to every IP.
- If Firebase requests return 401, confirm the client and FIREBASE_PROJECT_ID use the same Firebase project and that the request sends the current Firebase ID token.

## Web app cannot reach the API

- Start the API on port 3000 before using the web client.
- The web client currently targets http://localhost:3000/api; that address only works when the web browser and API run on the same computer.
- Confirm the web .env has the Firebase web app values with the VITE_FIREBASE_ prefix, then restart Vite after changing them.

## Mobile app cannot sign in or load todos

- Configure the EXPO_PUBLIC_FIREBASE_* values in the mobile app's local .env.
- Set EXPO_PUBLIC_API_URL to an address reachable from the device. On a physical phone, use the computer's LAN IP and ensure both devices can reach the development network.
- Use Firebase email/password credentials. The mobile app sends Firebase ID tokens and uses the same /api/todos endpoints and _id/completed fields as the server.

## Password recovery and account lookup

- Firebase sends email/password reset messages. The app deliberately uses the same confirmation message whether or not an account exists.
- Account ID lookup is disabled because revealing an account from a name alone exposes private account information. Use the email address associated with Firebase Authentication.


## API address configuration

- Web: set `VITE_API_URL` in `dont-forget-web/.env`; it defaults to `http://localhost:3000/api`.
- Mobile: set `EXPO_PUBLIC_API_URL` in `dont-forget-web/dont-forget-mobile/.env`; use a LAN address on a physical device.
- Restart the API after changing its `.env`. Restart Vite or Expo after changing client environment values.
