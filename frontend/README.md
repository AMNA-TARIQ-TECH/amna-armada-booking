# Booking — Frontend (React + Vite)

## Setup

```bash
cd frontend
npm install
```

Copy `.env` and set:

```
VITE_API_URL=http://localhost:4000/api
```

## Scripts

```bash
npm run dev      # http://localhost:3001
npm run build
npm run preview
npm run lint
```

## Structure

- `src/features/` — feature modules (auth, bookings, services, landing, …)
- `src/shared/` — shared UI, API client, types
- `src/pages/` — route page wrappers
- `src/App.tsx` — React Router routes
