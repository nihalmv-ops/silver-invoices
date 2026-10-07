# Silver Catering Backend (Render Deployment Guide)

Node.js, Express, and MongoDB REST API backend for **Silver Catering Management System**.

Frontend hosted at: [https://silver-invoices-delta.vercel.app/](https://silver-invoices-delta.vercel.app/)

---

## 🚀 How to Deploy on Render (Step-by-Step)

### Step 1: Push your Code to GitHub
Ensure this repository is pushed to your GitHub (`nihalmv-ops/silver-invoices`).

### Step 2: Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `nihalmv-ops/silver-invoices`.
4. Configure the settings:
   - **Name**: `silver-catering-backend` (or your preferred name)
   - **Region**: Singapore / Frankfurt / Oregon (closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `backend`  ⚠️ *(IMPORTANT: Enter `backend` so Render runs inside this folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Add Environment Variables in Render
Under the **Environment Variables** section on Render, add:
- `MONGODB_URI`: Your MongoDB Atlas connection string  
  *(e.g., `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/silver_catering?retryWrites=true&w=majority`)*
- `JWT_SECRET`: A secure random secret string  
  *(e.g., `silver_catering_secret_jwt_key_2026_luxury_events`)*
- `FRONTEND_URL`: `https://silver-invoices-delta.vercel.app`

### Step 4: Deploy & Get Your Backend URL
Click **Create Web Service**.  
Once deployed, Render will provide a live URL like:
`https://silver-catering-backend.onrender.com`

### Step 5: Connect Vercel Frontend to Render Backend
In your **Vercel Project Settings**:
1. Go to **Settings** > **Environment Variables**.
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://silver-catering-backend.onrender.com` *(your Render live URL)*
3. Trigger a redeploy on Vercel.

---

## 💻 Local Development

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Start the local backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Server will run on `http://localhost:5000`.

