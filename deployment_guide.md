# Cloud Deployment Guide - Skill Sharing Among Villagers

This document provides step-by-step instructions to deploy your full-stack project online for free. This is perfect for sharing a live link with your college review panel!

---

## 1. Database Setup: MongoDB Atlas (Free Cloud Hosting)

Render and other free hosts have ephemeral filesystems (which means any local JSON changes disappear when the server goes idle). For online deployments, you should use MongoDB Atlas:

1. Sign up for a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and select the **M0 (Free)** tier.
3. Choose your preferred region and click create.
4. Set up database security:
   * **Username & Password**: Create a database user (remember these credentials!).
   * **IP Access List**: Set it to `0.0.0.0/0` (Allow access from anywhere) so that Render can connect to your database.
5. In your cluster dashboard, click **Connect** -> **Drivers**, and copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/skillsharing?retryWrites=true&w=majority`

---

## 2. Push Your Project to GitHub

1. Create a new repository on your GitHub account.
2. In your local project directory, run:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

---

## 3. Deploy the Backend (Express API) on Render

1. Log in to [render.com](https://render.com) and click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following service settings:
   * **Name**: `skillsharing-api`
   * **Root Directory**: `server`
   * **Language**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   * `MONGODB_URI` = `your_mongodb_atlas_connection_string` (from Step 1)
   * `JWT_SECRET` = `your_custom_random_string`
   * `PORT` = `5000`
5. Click **Deploy Web Service**. Once deployed, Render will provide a live URL, e.g. `https://skillsharing-api.onrender.com`.

---

## 4. Deploy the Frontend (React Client) on Vercel

1. Log in to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Connect your GitHub repository.
3. Configure the following project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL` = `https://your-render-url.onrender.com/api` (Remember to append `/api` to your Render API link!)
5. Click **Deploy**. Vercel will build your application and generate a live public URL (e.g., `https://skill-sharing-among-villagers.vercel.app`).

---

## 5. Verify the Live Setup

1. Open your Vercel URL in the browser.
2. Try registering a new user or browsing trainers.
3. Verify that requests hit your Render backend and fetch data correctly from your MongoDB Atlas database cluster!
