# Materials Calculator

Web app for building material calculations with authentication, localization, and Firebase hosting.

## Main Features

- Calculators for brick, paint, and concrete.
- Authentication with email/password and Google.
- Route protection for authenticated pages.
- Localization via i18next (EN, RU, UK, PL).
- Theme switch support.
- SPA deployment to Firebase Hosting.

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase Auth + Firestore
- React Router
- i18next

## Project Structure

- src/app: app shell, router, auth context, Firebase setup, i18n config.
- src/features: feature modules (auth, brick, paint, concrete).
- src/pages: page-level components.
- src/shared: reusable components, utilities, and types.

## Quick Start

Prerequisites:

- Node.js 20+
- npm 10+

Install and run:

```bash
npm install
npm run dev
```

Default local URL:

- http://localhost:5173

## Environment Variables

Create .env.local in project root and provide Firebase values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Notes:

- The app validates Firebase config and blocks auth if values are missing.
- In production builds, localhost authDomain is normalized to projectId.firebaseapp.com.

## Available Scripts

- npm run dev: start Vite dev server.
- npm run build: type-check and build production bundle.
- npm run preview: preview built app locally.
- npm run lint: run ESLint.
- npm run test:i18n: verify locale key consistency across translations.
- npm run test:smoke: run quick i18n and e2e smoke checks in sequence.
- npm run test:e2e: run Playwright e2e smoke tests.
- npm run test:e2e:ui: run Playwright tests in interactive UI mode.
- npm run firebase:login: login to Firebase CLI.
- npm run firebase:deploy: build and deploy hosting.
- npm run firebase:deploy:ci: non-interactive hosting deploy.

## Firebase Setup Checklist

1. Enable Authentication in Firebase project.
2. Enable Google provider in Sign-in method.
3. Add local dev domains to Authorized domains:
   - localhost
   - 127.0.0.1 (if used)
4. Verify Hosting rewrites to index.html for SPA routes.

## Google OAuth Troubleshooting (Chrome)

If Google login fails with popup or redirect behavior:

1. Allow popups for:
   - http://localhost:5173
   - https://materials-calculator-a19ed.firebaseapp.com
2. Ensure third-party cookies are not blocked for the auth flow.
3. Disable privacy/ad-block extensions for local host.
4. Clear site data for localhost and firebaseapp.com.

## Deployment

This project is configured for Firebase Hosting using firebase.json.

Typical deploy flow:

```bash
npm run build
npm run firebase:deploy
```

## Smoke Checklist (Auth)

Run this checklist after auth-related changes and before release:

1. Open `/login` and sign in with Google.
2. Confirm user is redirected to the home page.
3. Refresh the page and confirm user stays authenticated.
4. Close and reopen browser tab, then confirm session is restored.
5. Click logout and confirm app redirects to `/login`.
6. Try opening `/` while logged out and confirm protected route redirects to `/login`.
7. Sign in with email/password (if test account exists) and verify flow matches Google behavior.

## Smoke Checklist (Calculators)

Run this checklist after calculator logic or UI changes:

1. Open each calculator card (brick, paint, concrete) from home page.
2. Enter valid sample values and confirm result is calculated.
3. Change one input and confirm result updates immediately.
4. Enter boundary values (0, very small decimals, large numbers) and confirm no crash.
5. Enter invalid values (negative numbers, empty required fields) and confirm validation behavior is correct.
6. Verify unit labels and numeric formatting are consistent.
7. Confirm layout is usable on desktop and mobile widths.

## Smoke Checklist (Localization and Theme)

Run this checklist after i18n or styling changes:

1. Switch language between EN, RU, UK, and PL.
2. Confirm key UI texts change on login, register, and home pages.
3. Confirm no untranslated placeholders/keys are visible.
4. Switch theme (light/dark) and confirm colors update on all main pages.
5. Refresh page and confirm selected language/theme are preserved.
6. Verify text wrapping and spacing remain correct in all languages.
7. Run `npm run test:i18n` and confirm locale key consistency check passes.
