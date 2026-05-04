# Vercel Deployment Guide for Growthory

This guide walks you through the step-by-step process of deploying both the **Express Backend** and **Next.js Frontend** to Vercel.

---

## Prerequisites
- Create a [Vercel](https://vercel.com/) account.
- Link your project repository to GitHub, GitLab, or Bitbucket.

---

## Step 1: Deploying the Express Backend

Since the repository is a monorepo, you will deploy the backend as its own Vercel project by pointing to the `server` root directory.

1. **Go to Vercel Dashboard**: Click on **Add New...** -> **Project**.
2. **Import Repository**: Select your repository from your Git provider.
3. **Configure Project Settings**:
   - **Project Name**: `growthory-api` (or similar)
   - **Framework Preset**: Choose **Other**
   - **Root Directory**: Select `server`
4. **Environment Variables**:
   Under the **Environment Variables** section, copy over the values from your `server/.env` file:
   - `MONGODB_URI`: *your MongoDB Atlas connection string*
   - `JWT_SECRET`: *your secure secret key*
   - `JWT_EXPIRES_IN`: `7d`
   - `OPENROUTER_API_KEY`: *your OpenRouter API key*
   - `OPENAI_BASE_URL`: `https://openrouter.ai/api/v1`
5. **Click Deploy**: Let Vercel build and deploy the backend.
6. **Copy Deployed Backend URL**: After deployment succeeds, copy the provided deployment domain (e.g., `https://growthory-api.vercel.app`).

---

## Step 2: Deploying the Next.js Frontend

Now, you will create a second project for the frontend.

1. **Go to Vercel Dashboard**: Click on **Add New...** -> **Project**.
2. **Import Repository**: Select the exact same repository from your Git provider.
3. **Configure Project Settings**:
   - **Project Name**: `growthory`
   - **Framework Preset**: Choose **Next.js**
   - **Root Directory**: Select `client`
4. **Environment Variables**:
   Under the **Environment Variables** section, add your frontend environment variables:
   - `NEXT_PUBLIC_API_URL`: Paste the backend URL you copied from **Step 1**, and append `/api` to the end. For example:
     `https://growthory-api.vercel.app/api`
5. **Click Deploy**: Vercel will automatically detect the Next.js setup and start building.
6. **Enjoy!**: Your complete web application is now fully deployed.

---

## Advanced: Checking Deployed Logs
- **For Backend**: Navigate to your `growthory-api` project in Vercel, click the **Logs** tab to view your Node runtime logs, database connections, or API errors.
- **For Frontend**: Navigate to your `growthory` project in Vercel to check build success or user-side performance analytics.
