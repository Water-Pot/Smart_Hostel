# Smart Hostel Frontend (Next.js)

A modern Next.js dashboard UI for the Smart Hostel Spring Boot backend.

## Features

- Beautiful responsive admin-style interface
- User signup + login (JWT)
- Live dashboard cards for roles, floors, rooms, and menus
- Create actions for role, floor, room, meal type, menu item, and menu
- Backend proxy rewrite (`/backend/*`) to reduce browser CORS issues during development

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Start backend on `http://localhost:8000` (or update `NEXT_PUBLIC_BACKEND_URL`)
4. Run frontend:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

## Scripts

- `npm run dev` - start development server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - run production server
