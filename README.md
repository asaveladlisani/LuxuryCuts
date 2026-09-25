# LuxuryCuts — Full-Stack Barber Shop Assessment

A production-style React + TypeScript barber shop website for the Talent Forge practical assessment.

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui approach (reusable UI primitives/components)
- Framer Motion
- Node.js + Express + TypeScript
- PostgreSQL via node-postgres (`pg`)

## Run locally

```bash
npm install
npm install --prefix client
npm install --prefix server
cp client/.env.example client/.env
cp server/.env.example server/.env

# Local Postgres (or set DATABASE_URL to your Render external URL)
docker run -d --name luxurycuts-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=luxurycuts -p 5432:5432 postgres:16-alpine

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
- Postgres-backed service, barber and booking data (tables and seed data are created on startup)
- Real booking creation and slot availability
- Dynamic Google Calendar event URL
- Dynamic `.ics` calendar download compatible with Apple Calendar and other calendar clients
- Booking confirmation with selected service, barber, date, time and duration

## Production deployment (free demo)

**API + database → Render (free web service + free Postgres)**
1. In Render: **New → Blueprint**, select this repo. `render.yaml` creates the `luxurycuts-db` Postgres database and the `luxurycuts-api` web service from `server/`, with `DATABASE_URL` wired up automatically.
2. Note the service URL, e.g. `https://luxurycuts-api.onrender.com`.

The free web service sleeps after ~15 min idle (first request takes ~30–60s). Bookings persist in Postgres across restarts, but Render's free Postgres databases expire after a limited period (30 days at the time of writing); after that, create a new one and redeploy.

**Client → GitHub Pages**
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Repo **Settings → Secrets and variables → Actions → Variables**: add `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`.
3. Push to `main` (or run the workflow manually). The site is published at `https://asaveladlisani.github.io/LuxuryCuts/`.

The client uses hash routing (`/#/booking`) so page refreshes work on GitHub Pages.

### Environment variables

| File | Variable | Purpose |
|---|---|---|
| `client/.env` | `VITE_API_URL` | API base URL (with `/api`) |
| `client/.env` | `VITE_BASE_PATH` | Base path the site is served from (`/` locally) |
| `server/.env` | `PORT` | API port (Render sets this) |
| `server/.env` | `CORS_ORIGIN` | Comma-separated allowed origins; empty allows all |
| `server/.env` | `DATABASE_URL` | Postgres connection string (Render sets this) |

Copy each `.env.example` to `.env` for local development.
