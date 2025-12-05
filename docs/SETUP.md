# 🔧 Setup Guide

> [🇹🇷 Türkçe](SETUP_TR.md) | [🇬🇧 English](SETUP.md)

Complete local development setup guide for the portfolio project.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Database Configuration](#database-configuration)
- [Admin Panel Setup](#admin-panel-setup)
- [Verification](#verification)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

### **Required Software**

- [ ] **Node.js** 20.x or higher (LTS recommended)
  - Download: [nodejs.org](https://nodejs.org/)
  - Verify: `node --version` (should be v20+)
- [ ] **npm** or **yarn** or **pnpm** package manager
  - Verify: `npm --version` or `yarn --version`
- [ ] **PostgreSQL** 14+ database
  - Download: [postgresql.org](https://www.postgresql.org/download/)
  - Alternative: Docker setup (see below)
- [ ] **Git** version control
  - Download: [git-scm.com](https://git-scm.com/)

### **Optional Tools**

- [ ] **VS Code** (recommended code editor)
- [ ] **DBeaver** or **pgAdmin** (database GUI)
- [ ] **GitHub CLI** (for GitHub integration)

---

## ⚡ Quick Start

**Get up and running in 5 minutes:**

```bash
# 1. Clone repository
git clone https://github.com/Norethion/my-portfolio.git
cd my-portfolio

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local  # If available
# Or create manually with content below

# 4. Start PostgreSQL (if not running)
# Windows: Run PostgreSQL service
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# 5. Create database
createdb portfolio

# 6. Run migrations
npx drizzle-kit push

# 7. Start dev server
npm run dev

# 8. Open browser
# Navigate to http://localhost:3000
```

---

## 📖 Detailed Setup

### **Step 1: Clone Repository**

```bash
# Using HTTPS
git clone https://github.com/Norethion/my-portfolio.git

# Or using SSH
git clone git@github.com:Norethion/my-portfolio.git

# Navigate to project
cd my-portfolio
```

### **Step 2: Install Dependencies**

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Installation includes:**
- Next.js 16 framework
- React 19 UI library
- Drizzle ORM for database
- shadcn/ui components
- Vanta.js for WebGL effects
- Zustand for state management
- And more...

### **Step 3: Configure Environment Variables**

Create a `.env.local` file in the root directory:

```env
# ===========================================
# DATABASE CONFIGURATION
# ===========================================

# Local PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio

# ===========================================
# SUPABASE (Optional - for advanced features)
# ===========================================

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ===========================================
# DEVELOPMENT FLAGS
# ===========================================

# Enable debug mode (optional)
DEBUG=true
```

### **Step 4: Database & Admin Setup**

1. **Create the database:**
```bash
createdb portfolio
```

2. **Create tables:**
```bash
npx drizzle-kit push
```

3. **Admin Password & GitHub Setup:**
Run this script to set your admin password and GitHub username in the database:
```bash
npm run setup
```
Follow the prompts in the terminal.

### **Step 4: PostgreSQL Installation**

If PostgreSQL is not installed on your machine:

#### **Option A: Local Installation**

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password you set
4. Start PostgreSQL service

**macOS:**
```bash
# Using Homebrew
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Option B: Docker** (Alternative)

```bash
# Run PostgreSQL in Docker
docker run --name portfolio-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:16-alpine

# Access database
docker exec -it portfolio-db psql -U postgres -d portfolio
```

### **Step 5: Database & Admin Setup**

Once PostgreSQL service is running:

1. **Create the database:**
```bash
createdb portfolio
```

2. **Create tables:**
```bash
npx drizzle-kit push
```

3. **Admin Password & GitHub Setup:**
Run this script to set your admin password and GitHub username in the database:
```bash
npm run setup
```
Follow the prompts in the terminal.

### **Step 6: Start Development Server**

```bash
npm run dev

# Or with port specification
PORT=3000 npm run dev
```

**Expected Output:**

```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
✓ Compiled / in 500ms
```

**Open in Browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Configuration

### **Connection String Format**

```
postgresql://username:password@host:port/database
```

**Examples:**

```env
# Local default
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio

# Custom user and port
DATABASE_URL=postgresql://myuser:mypassword@localhost:5433/portfolio

# Remote database
DATABASE_URL=postgresql://user:pass@db.example.com:5432/portfolio
```

### **Drizzle Configuration**

The project uses `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### **Database Schema Overview**

**Tables:**

1. **personal_info** - User bio, contact, social links
2. **projects** - GitHub & manual projects
3. **cv_experiences** - Work experience entries
4. **cv_education** - Education history
5. **cv_skills** - Skills by category
6. **settings** - Application settings

**Relationships:**
- All tables have auto-incrementing `id`
- `order` field for sorting
- `created_at` timestamps
- Soft delete capability

---

## 🔐 Admin Panel Setup

### **Access Admin Panel**

1. Start the development server: `npm run dev`
2. Open browser: http://localhost:3000
3. Press `Ctrl+K` (or `Cmd+K` on Mac) anywhere
4. Enter admin password (from `.env.local`)
5. Click **"Login"**

### **Admin Password**

You set your admin password in **Step 5** using `npm run setup`.

**To Change Password:**

You can run the setup script again:
```bash
npm run setup
```
OR manually update the `admin_password` value in the `settings` table of your database.

**Security Recommendations:**

- Use 16+ characters
- Include uppercase, lowercase, numbers, symbols
- Don't use common passwords
- Consider using a password manager

**Example Strong Password:**

```
MyPortfolio2024$ecure!
```

### **Admin Panel Features**

Once logged in, you can:

#### **👤 Personal Information**
- Edit name, job title, bio (TR/EN)
- Update contact info (email, phone, location)
- Manage social links (GitHub, LinkedIn, Twitter, etc.)
- Upload or link avatar
- Set languages

#### **💼 Projects**
- Sync projects from GitHub
- Add manual projects
- Toggle project visibility
- Reorder with drag-and-drop
- Manage project metadata

#### **📄 CV Management**
- Add/edit work experiences
- Update education history
- Manage skills by category
- Import from LinkedIn (JSON/CSV/ZIP)

---

## ✅ Verification

### **Check Installation**

Run these commands to verify everything is set up correctly:

```bash
# Check Node.js version
node --version  # Should be v20+

# Check PostgreSQL
psql --version  # Should be 14+

# Check dependencies installed
npm list --depth=0

# Verify database connection
psql -d portfolio -c "SELECT COUNT(*) FROM personal_info;"

# Check development server
npm run dev  # Should start without errors
```

### **Test Website**

1. **Homepage**
   - Navigate to http://localhost:3000
   - Should load without errors
   - Dark/Light mode toggle works
   - Language switcher works (TR/EN)

2. **Admin Panel**
   - Press `Ctrl+K`
   - Login with admin password
   - Dashboard loads
   - All sections accessible

3. **Database Connection**
   - Try adding personal info
   - Save changes
   - Verify persistence

4. **API Routes**
   - Check network tab in DevTools
   - API calls should return 200 status
   - No CORS errors

---

## 🔄 Development Workflow

### **Common Commands**

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx drizzle-kit push      # Push schema changes
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Run migrations
npx drizzle-kit studio    # Open Drizzle Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type check (if available)
```

### **Database Development**

**Making Schema Changes:**

1. Edit `lib/db/schema.ts`
2. Run: `npx drizzle-kit push`
3. Changes applied immediately

**Using Drizzle Studio:**

```bash
npx drizzle-kit studio

# Opens visual database editor at:
# http://localhost:4983
```

**Backup Database:**

```bash
# Export data
pg_dump -d portfolio > backup.sql

# Import data
psql -d portfolio < backup.sql
```

### **File Structure**

```
my-portfolio/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities
│   └── db/               # Database files
│       ├── schema.ts     # Drizzle schema
│       └── drizzle.ts    # DB client
├── public/               # Static assets
├── stores/               # Zustand stores
├── drizzle/              # Migrations
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

---

## 🔧 Troubleshooting

### **Issue: Port 3000 Already in Use**

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### **Issue: Database Connection Failed**

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Check PostgreSQL is running:
```bash
# Windows
sc query postgresql-x64-16

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

2. Verify connection string in `.env.local`
3. Check database exists:
```bash
psql -l | grep portfolio
```

### **Issue: Module Not Found**

**Error:**
```
Module not found: Can't resolve 'xyz'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### **Issue: Migration Errors**

**Error:**
```
Failed to push migration
```

**Solution:**
```bash
# Drop and recreate database
dropdb portfolio
createdb portfolio
npx drizzle-kit push

# Or reset specific table
psql -d portfolio -c "DROP TABLE IF EXISTS personal_info CASCADE;"
npx drizzle-kit push
```

### **Issue: Admin Panel Not Loading**

**Error:**
```
Admin authentication failed
```

**Solution:**
1. Check `NEXT_PUBLIC_ADMIN_KEY` in `.env.local`
2. Verify no extra spaces or quotes
3. Restart dev server: `npm run dev`
4. Clear browser localStorage:
```javascript
// In browser console
localStorage.clear()
```

---

## 📚 Additional Resources

### **Documentation**

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [React Docs](https://react.dev)
- 📖 [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- 📖 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 📖 [shadcn/ui Docs](https://ui.shadcn.com)

### **Tutorials**

- 🎥 Next.js Crash Course
- 🎥 PostgreSQL Basics
- 🎥 TypeScript for React
- 🎥 Tailwind CSS Tutorial

### **Tools**

- 🔍 [Drizzle Studio](http://localhost:4983)
- 🔍 [PostgreSQL GUI Tools](https://www.postgresql.org/download/)
- 🔍 [Next.js Dev Tools](https://nextjs.org/docs)

### **Community**

- 💬 GitHub Discussions
- 💬 Discord Community
- 💬 Stack Overflow

---

## 🎉 Next Steps

After successful setup:

1. ✅ Explore the admin panel
2. ✅ Add your personal information
3. ✅ Sync GitHub projects
4. ✅ Import CV data from LinkedIn
5. ✅ Customize the theme
6. ✅ Deploy to production

**Ready to deploy?** See [Deployment Guide](DEPLOYMENT.md)

---

<div align="center">

**Happy Coding! 🚀**

Made with ❤️ by Norethion

</div>

