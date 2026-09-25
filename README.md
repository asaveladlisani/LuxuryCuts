# LuxuryCuts — Full-Stack Barber Shop Assessment

A production-style React + TypeScript barber shop website for the Talent Forge practical assessment.

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui approach (reusable UI primitives/components)
- Framer Motion
- Node.js + Express + TypeScript
- SQLite via better-sqlite3

## Run locally

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000/api/health

Set `client/.env` if the API is deployed separately:

```env
VITE_API_URL=https://your-api.example.com/api
```

## Existing features
- Responsive home, services, about, booking and terms pages
- Mobile navigation
- Promotional modal
- SQLite-backed service, barber and booking data
- Real booking creation and slot availability
- Dynamic Google Calendar event URL
- Dynamic `.ics` calendar download compatible with Apple Calendar and other calendar clients
- Booking confirmation with selected service, barber, date, time and duration

## Production deployment
Build the client with `npm run build --prefix client`. Deploy the generated `client/dist` as a static frontend and the Express server as a Node service with a persistent SQLite volume. For production, set `VITE_API_URL` to the public API URL.
