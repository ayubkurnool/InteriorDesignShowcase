# Atelier Forme full-stack app

## Run locally

```bash
npm install
npm run dev
```

The Vite client runs at `http://localhost:3000` and the Express API at `http://localhost:4000`.

Demo accounts:
- Admin: `admin@interior.com` / `Admin@123`
- Employee: `employee@interior.com` / `Employee@123`

## Production configuration

Set `JWT_SECRET`, `CLIENT_URL`, `PORT`, and `NODE_ENV=production`. The API uses SQLite locally and persists leads, users, and portfolio projects in `server/interior.db`. For serverless Vercel deployment, use a hosted database adapter (Turso, Neon, or Supabase) and move `server/index.js` endpoints into Vercel Functions; Netlify can proxy `/api/*` to a separately hosted Node service.

Never use the demo credentials or fallback JWT secret in production.
