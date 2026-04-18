# Smart Hostel Frontend (Next.js)

A modern Next.js dashboard UI for the Smart Hostel Spring Boot backend.

## Features

- Beautiful responsive admin-style interface
- Complete endpoint catalog (all backend methods included)
- Interactive API workstation (path params, query params, JSON body editor)
- User signup + login (JWT) with token persistence
- Multipart profile image upload support
- Response viewer with formatted output
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
