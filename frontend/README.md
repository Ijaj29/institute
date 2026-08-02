# Institute Management — Login

A login screen for an institute management system, built with React 18, TypeScript, Tailwind CSS and Vite.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server runs with `VITE_USE_MOCK_AUTH=true` by default, so you can sign in with any
email + a password of 6+ characters — no backend required.

## Connecting to your NestJS API

Set `VITE_USE_MOCK_AUTH=false` and `VITE_API_BASE_URL` to your NestJS server in `.env`.
`src/services/authService.ts` posts to `${VITE_API_BASE_URL}/auth/login` with
`{ email, password }` and expects `{ user, token }` back — match this to your
`AuthModule` controller, or adjust the service to fit your existing response shape.

## Structure

```
src/
 ├── app/            # Root App component (providers + router)
 ├── components/
 │   ├── ui/          # Generic building blocks (Button, TextField)
 │   └── auth/        # Login-specific components (BrandPanel, LoginForm)
 ├── context/         # AuthContext (session state)
 ├── hooks/           # useAuth
 ├── layouts/         # AuthLayout (split brand/form screen)
 ├── pages/           # Login, Dashboard
 ├── routes/          # AppRoutes, ProtectedRoute
 ├── services/        # authService (API calls)
 ├── types/           # auth.types.ts
 └── utils/           # validators, storage
```
