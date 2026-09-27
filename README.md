# Atelier Forme - Full-Stack Interior Design App

## Production Deployment on Vercel + Render

### Frontend (Vercel)

1. **Push to GitHub** (already done: `ayubkurnool/InteriorDesignShowcase`)

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import repository: `ayubkurnool/InteriorDesignShowcase`
   - Framework: **Vite**
   - Root directory: `.`
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Set Environment Variables** in Vercel Project Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
   Replace `your-render-backend-url` with your actual Render service URL.

4. **Deploy** → Vercel will build and host the frontend.

---

### Backend (Render)

1. **Prepare Backend for Render**:
   - Create a `server/.env.production` file (not committed):
     ```
     PORT=10000
     JWT_SECRET=your-super-secure-random-string-here
     CLIENT_URL=https://your-vercel-frontend-url.vercel.app
     NODE_ENV=production
     ```
   - Render will use environment variables from the dashboard.

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repo: `ayubkurnool/InteriorDesignShowcase`
   - Name: `interior-api`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Build command: `npm install`
   - Start command: `node server/index.js`
   - Instance type: Free (or paid for production)

3. **Set Environment Variables** in Render Dashboard:
   ```
   PORT=10000
   JWT_SECRET=your-super-secure-random-string-here
   CLIENT_URL=https://your-vercel-frontend-url.vercel.app
   NODE_ENV=production
   ```

4. **Deploy** → Render will host your backend API.

5. **Copy the Render URL** (e.g., `https://interior-api-xxxxx.onrender.com`) and update Vercel's `VITE_API_URL` to this value.

---

### Database (SQLite on Render)

- SQLite database file (`server/interior.db`) persists on Render's filesystem.
- For production with multiple instances, migrate to **PostgreSQL** (use Supabase, Neon, or Render Postgres).
- For now, SQLite works fine for a single-instance backend.

---

### Running Locally

```bash
npm install

# Create a .env file for local development:
# VITE_API_URL=http://localhost:4000

npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000`

---

### Production URLs

Once deployed:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://interior-api-xxxxx.onrender.com`
- **API calls**: Automatically routed to the Render backend via `VITE_API_URL`

---

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random string (use `openssl rand -base64 32`)
- [ ] Set `CLIENT_URL` to your actual Vercel domain in Render env vars
- [ ] Enable CORS on both services (already configured in `server/index.js`)
- [ ] Use HTTPS for all API calls (Vercel and Render provide HTTPS by default)
- [ ] Rotate credentials periodically
- [ ] For production, migrate SQLite to PostgreSQL

---

### WhatsApp Integration

Update the WhatsApp phone number in `src/App.jsx` (line with `wa.me/15550000000`):

```javascript
href="https://wa.me/YOUR_PHONE_NUMBER?text=Hi%20Atelier%20Forme..."
```

Replace `YOUR_PHONE_NUMBER` with your actual WhatsApp business number (include country code, e.g., `15551234567` for +1-555-123-4567).

---

### Monitoring & Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Service → Logs

---

## Summary

This setup is production-ready for your interior business:
✅ Premium frontend on Vercel (global CDN)
✅ Secure backend API on Render
✅ SQLite database (upgrade to Postgres if needed)
✅ WhatsApp lead generation
✅ Admin & employee authentication
✅ Project gallery and detail pages
