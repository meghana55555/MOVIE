# BOOKY – Movie & Auth App

Front-end Netflix-style movie app + Registration/Login (BOOKY) per project specs.

## Features

- **BOOKY Sign-up**: Full name, Username, Email, Password, Confirm Password. Passwords encoded before storage. Auto-redirect to Login after registration.
- **BOOKY Login**: Username, Password. Data fetched and compared with DB. On success → Netflix-style landing page.
- **Netflix-style Browse**: Fetches movies from OMDB API. Featured banner + rows (Trending Now, New This Week, etc.).

## Tech Stack

- **Client**: React (Vite), React Router
- **Server**: Node.js, Express, MySQL, bcrypt, JWT
- **API**: OMDB (proxy through server to keep API key secure)

## Setup

### 1. Create MySQL Database

Create database `booky`. The **User** table is created automatically on server start. Or run `server/schema.sql` manually.

### 2. Server (backend)

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL and OMDB_API_KEY
npm install
npm run dev
```

### 3. Client (frontend)

```bash
cd client
npm install
npm run dev
```

### 4. Run both (from project root)

```bash
npm install
npm run dev
```

## Environment Variables

| Variable       | Description                  |
|---------------|------------------------------|
| `OMDB_API_KEY`| OMDB API key (e.g. 6be3423a) |
| `JWT_SECRET`  | Secret for JWT signing       |
| `DB_HOST`     | MySQL host                   |
| `DB_USER`     | MySQL user                   |
| `DB_PASSWORD` | MySQL password               |
| `DB_NAME`     | Database name (booky)        |

## Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy frontend on Vercel**
   - [vercel.com](https://vercel.com) → Add New → Project
   - Import your GitHub repo
   - **Root Directory**: `client`
   - Build Command: `npm run build`
   - Output: `dist`
   - Add env var: `VITE_API_URL` = your backend URL (e.g. `https://your-api.onrender.com`)

3. **Deploy backend**
   - Use [Render](https://render.com) or [Railway](https://railway.app) for the `server` folder
   - Set `OMDB_API_KEY`, `JWT_SECRET`, MySQL connection vars
   - Use a hosted MySQL (e.g. [Aiven](https://aiven.io) free tier)
