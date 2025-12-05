# 🚀 Deployment Guide

> [🇹🇷 Türkçe](DEPLOYMENT_TR.md) | [🇬🇧 English](DEPLOYMENT.md)

Complete guide to deploying your portfolio to production using **Vercel** and **Supabase**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start (2 Minutes)](#quick-start-2-minutes)
- [Detailed Setup](#detailed-setup)
- [Database Migration](#database-migration)
- [Environment Variables](#environment-variables)
- [Deploy to Vercel](#deploy-to-vercel)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)

---

## 🎯 Overview

This guide covers:

- ✅ **Vercel** - Frontend hosting and deployment
- ✅ **Supabase** - PostgreSQL database hosting
- ✅ **Database Migration** - Setting up schema
- ✅ **Environment Variables** - Configuration
- ✅ **Production Checklist** - Verification steps

### **Why Vercel + Supabase?**

| Feature | Benefit |
|---------|---------|
| 🚀 **Fast Deployment** | One-click deploy from GitHub |
| 💰 **Free Tier** | Generous limits for hobby projects |
| 🔒 **Built-in Security** | HTTPS, environment variables |
| 📊 **Analytics** | Built-in performance monitoring |
| 🔗 **Easy Integration** | Vercel ↔ Supabase seamless connection |
| 🌐 **Global CDN** | Fast loading worldwide |
| 🔄 **Auto Scaling** | Handles traffic spikes |
| 💾 **Automatic Backups** | Daily database backups |

---

## 📋 Prerequisites

Before starting, ensure you have:

- [x] GitHub account and repository
- [x] Vercel account (free signup at [vercel.com](https://vercel.com))
- [x] Supabase account (free signup at [supabase.com](https://supabase.com))
- [x] Local project setup completed
- [x] `.env.local` configured locally

---

## ⚡ Quick Start (2 Minutes)

**Fastest way to get your portfolio live:**

### **1. Create Supabase Database**

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `my-portfolio`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### **2. Get Connection String**

1. In Supabase dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Click **"Connection pooling"** tab
4. Select **"Transaction"** mode
5. Copy the connection string

**Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### **3. Run Migration**

Two options:

#### **Option A: Supabase SQL Editor** (Recommended)

1. Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Paste the SQL from `drizzle/0000_redundant_naoko.sql` (or see below)
4. Click **"Run"** (or press CTRL+Enter)

**Migration SQL:**
```sql
-- Enum Types (Won't error if exists)
DO $$ BEGIN
    CREATE TYPE "public"."skill_category" AS ENUM('Frontend', 'Backend', 'Mobile', 'Desktop', 'DevOps', 'Database', 'Tools', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."skill_level" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "personal_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"job_title" varchar(255),
	"bio_tr" text,
	"bio_en" text,
	"email" varchar(255),
	"phone" varchar(50),
	"github" varchar(255),
	"linkedin" varchar(255),
	"twitter" varchar(255),
	"instagram" varchar(255),
	"facebook" varchar(255),
	"location" varchar(255),
	"avatar" text,
	"languages" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" integer UNIQUE,
	"name" varchar(255) NOT NULL,
	"description" text,
	"custom_description" text,
	"url" text NOT NULL,
	"homepage" text,
	"language" varchar(50),
	"stars" integer DEFAULT 0 NOT NULL,
	"topics" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_manual" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"current" boolean DEFAULT false NOT NULL,
	"description" text,
	"location" varchar(255),
	"employment_type" varchar(50),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"field" varchar(255),
	"start_date" varchar(50) NOT NULL,
	"end_date" varchar(50),
	"description" text,
	"grade" varchar(50),
	"activities" text,
	"location" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"level" varchar(50) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) UNIQUE NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- NEW TABLES
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "visitor_stats" (
	"date" varchar(15) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
```

✅ **Migration complete!**

#### **Option B: Local Terminal**

1. Temporarily add production `DATABASE_URL` to `.env.local`
2. Run: `npx drizzle-kit push`
3. Remove production URL from `.env.local`

### **4. Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Add environment variables (see below)
5. Click **"Deploy"**

**Done! 🎉** Your site is now live!

---

## 📖 Detailed Setup

### **Step 1: Supabase Project Creation**

#### **Method A: Direct from Supabase**

1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Organization:** Select or create
   - **Name:** `my-portfolio` (or your choice)
   - **Database Password:** Strong password
   - **Region:** Closest to your users
5. Click **"Create new project"**
6. Wait ~2 minutes

#### **Method B: Via Vercel** (Alternative)

1. Vercel Dashboard → Your Project → **Storage**
2. Click **"Create Database"**
3. Select **Supabase**
4. Follow prompts

### **Step 2: Connection String Setup**

**Important:** Always use **connection pooling** in production!

1. Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Click **"Connection pooling"** tab
4. Select **"Transaction"** mode (recommended)
5. Copy the full connection string

**Connection String Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Why Transaction Mode?**

| Mode | Use Case |
|------|----------|
| **Transaction** | Default, best for most apps (recommended) |
| **Session** | Long-lived connections |
| **Statement** | Read-only queries |

**⚠️ Important Notes:**

- Never expose your password in code
- Use environment variables only
- Keep connection strings secure

### **Step 3: Database Migration**

Choose the method that works best for you:

#### **Method A: Supabase SQL Editor** (Easiest)

1. Supabase Dashboard → **SQL Editor**
2. Click **"New Query"** button
3. Paste migration SQL (from Quick Start section)
4. Click **"Run"** or press `CTRL+Enter`
5. See success message: "Success. No rows returned"

**Alternative:** Read from your local file:
```bash
# In your local terminal
cat drizzle/0000_redundant_naoko.sql | pbcopy  # Mac
cat drizzle/0000_redundant_naoko.sql | clip    # Windows
# Then paste in SQL Editor
```

#### **Method B: Drizzle CLI** (For developers)

1. **Temporarily** add production URL to `.env.local`:
```env
# Temporary - remove after migration!
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

2. Run migration:
```bash
npx drizzle-kit push
```

3. **IMPORTANT:** Remove production URL from `.env.local`:
```env
# Keep only your local database
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
```

#### **Verification**

Check your tables were created:

1. Supabase Dashboard → **Table Editor**
2. You should see:
   - ✅ `personal_info`
   - ✅ `projects`
   - ✅ `cv_experiences`
   - ✅ `cv_education`
   - ✅ `cv_skills`
   - ✅ `settings`

---

## 🔐 Environment Variables

### **Required Variables**

Add these to Vercel:

#### **1. DATABASE_URL**

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Environments:** Production ✅, Preview ✅, Development ✅

#### **2. NEXT_PUBLIC_ADMIN_KEY**

```env
NEXT_PUBLIC_ADMIN_KEY=your-secure-admin-password
```

**Environments:** Production ✅, Preview ✅, Development ✅

**⚠️ Security Tips:**
- Use a strong password (16+ characters)
- Consider using a password manager
- Different passwords for different environments

### **Optional Variables**

#### **3. GITHUB_USERNAME** (for project sync)

```env
GITHUB_USERNAME=your-github-username
```

#### **4. GITHUB_TOKEN** (to avoid rate limits)

```env
GITHUB_TOKEN=ghp_your_personal_access_token
```

**How to get GitHub Token:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Select scope: `public_repo`
5. Copy token (only shown once!)

### **Adding to Vercel**

1. Vercel Dashboard → Your Project → **Settings**
2. **Environment Variables** (left sidebar)
3. Click **"Add New"**
4. Fill in:
   - **Name:** Variable name (e.g., `DATABASE_URL`)
   - **Value:** Variable value
   - **Environments:** Select all three (Production, Preview, Development)
5. Click **"Save"**

### **Important:** Restart After Adding Variables

After adding environment variables:
1. Go to **Deployments**
2. Click **"⋯"** → **"Redeploy"**
3. Wait for deployment to complete

---

## 🚀 Deploy to Vercel

### **Method A: GitHub Integration** (Recommended)

#### **1. Push to GitHub**

```bash
# In your local terminal
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### **2. Import to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"** or **"Import"**
3. Select your GitHub account
4. Choose your repository
5. Click **"Import"**

#### **3. Configure Project**

**Build Settings** (usually auto-detected):
- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`

**Deploy**

1. Review configuration
2. Click **"Deploy"**
3. Wait ~2-3 minutes

🎉 **Your site is live!**

### **Method B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### **Method C: Git Push Auto-Deploy**

After first setup, every push to `main` triggers automatic deployment!

1. Push to `main` branch
2. Vercel detects changes
3. Auto-deploys to production

**Preview deployments** are created for every branch/PR.

---

## ✅ Post-Deployment

### **1. Verify Site is Live**

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Check homepage loads
3. Test navigation

### **2. Test Admin Panel**

1. Press `Ctrl+K` anywhere
2. Enter admin password
3. Verify dashboard loads
4. Check all sections (Personal Info, Projects, CV)

### **3. Test Database Connection**

In Admin Panel:
1. Go to **Personal Information**
2. Try editing your bio
3. Save changes
4. Check if changes appear on homepage

### **4. Test GitHub Integration** (if enabled)

1. Admin Panel → **Projects**
2. Click **"Sync from GitHub"**
3. Verify projects appear

### **5. Check Build Logs**

Vercel Dashboard → **Deployments** → Click latest → **Logs**

**Look for:**
- ✅ Build successful
- ✅ No errors
- ✅ All pages generated

---

## 🔧 Troubleshooting

### **Issue: "DATABASE_URL is not set"**

**Symptoms:**
- Build succeeds but site shows error
- Environment variable missing

**Solution:**
1. Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` exists
3. Check all environments are selected (Prod, Preview, Dev)
4. Redeploy after adding

### **Issue: Connection Timeout**

**Symptoms:**
- Admin panel won't load
- Database errors in logs

**Solution:**
1. Verify connection string includes `?pgbouncer=true`
2. Check using **Transaction** mode
3. Supabase Dashboard → Settings → Database → Connection pooling should be enabled
4. Try resetting password if needed

### **Issue: "Relation does not exist"**

**Symptoms:**
- Table not found errors
- Data not saving

**Solution:**
- Migration not completed
- Run migration again (SQL Editor or Drizzle)
- Verify tables exist in Supabase Table Editor

### **Issue: Password Authentication Failed**

**Symptoms:**
- Cannot connect to database
- Wrong password errors

**Solution:**
1. Supabase Dashboard → Settings → Database
2. **Reset Database Password**
3. Update connection string with new password
4. Update Vercel environment variable
5. Redeploy

### **Issue: Build Fails**

**Symptoms:**
- Deployment fails
- Build errors in logs

**Solution:**
1. Check logs for specific error
2. Common issues:
   - TypeScript errors → Fix locally first
   - Missing dependencies → Check `package.json`
   - Environment variables not set → Add to Vercel
3. Test build locally: `npm run build`

### **Issue: Slow Loading**

**Symptoms:**
- Site loads but very slow
- API calls timing out

**Solution:**
1. Check Supabase region matches Vercel
2. Enable connection pooling
3. Check database size (free tier: 500MB)
4. Optimize images and assets
5. Enable Vercel Analytics

---

## 🎓 Advanced Topics

### **Custom Domain**

1. Vercel → Project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records (shown in Vercel)
4. Wait for propagation (~24 hours)

### **Environment-Specific Variables**

Use different databases for different environments:

**Production:**
```
DATABASE_URL=postgresql://...production-db
```

**Preview:**
```
DATABASE_URL=postgresql://...preview-db
```

### **Database Backups**

**Supabase auto-backups:**
- Daily automatic backups
- Available for 7 days
- Settings → Database → Backups

**Manual backup:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup.sql
```

### **Monitoring**

**Vercel Analytics:**
- Built-in performance monitoring
- Real-time metrics
- User analytics

**Supabase Monitoring:**
- Database performance
- Query analytics
- Connection pool stats

### **Scaling**

**Free Tier Limits:**

| Service | Limit |
|---------|-------|
| Vercel | 100GB bandwidth |
| Supabase | 500MB database, 2GB bandwidth |

**When to upgrade:**
- Exceeding bandwidth limits
- Outgrowing database storage
- Need for more features

---

## 📊 Production Checklist

Before going live, verify:

- [ ] Supabase project created
- [ ] Connection string with pooling obtained
- [ ] Migration completed successfully
- [ ] Environment variables added to Vercel
- [ ] Admin password set (strong)
- [ ] GitHub credentials added (if using)
- [ ] Site deployed to Vercel
- [ ] Homepage loads correctly
- [ ] Admin panel accessible (`Ctrl+K`)
- [ ] Database write operations work
- [ ] No errors in build logs
- [ ] HTTPS enabled (automatic)
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

Your portfolio is now live! 🚀

**Next Steps:**
1. Add your personal information
2. Import or add projects
3. Fill in your CV
4. Share your portfolio!

**Need Help?**

- 📖 [Setup Guide (English)](../docs/SETUP.md)
- 📖 [Troubleshooting](#troubleshooting)
- 🐛 [Report Issues](https://github.com/Norethion/my-portfolio/issues)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

<div align="center">

**Made with ❤️ by Norethion**

</div>

