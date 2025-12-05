# 🚀 My Portfolio

> [🇹🇷 Türkçe](README_TR.md) | [🇬🇧 English](README.md)

A modern, full-stack personal portfolio website built with **Next.js 16**, **TypeScript**, and **PostgreSQL**. Features a hidden admin panel, bilingual support (TR/EN), and seamless GitHub project integration.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🎨 **User-Facing Features**
- **Modern UI** - Clean, minimal design with smooth animations
- **Dark/Light Mode** - System-aware theme toggle
- **Bilingual Support** - Turkish/English language switching
- **Responsive Design** - Mobile-first, works on all devices
- **WebGL Effects** - Interactive fluid background using Vanta.js
- **CV Display** - Professional resume page with print support
- **Contact Form** - Get in touch with visitors
- **SEO Optimized** - Meta tags, sitemap, and semantic HTML

### 🔐 **Admin Panel Features**
- **Hidden Access** - Press `Ctrl+K` anywhere to login
- **Personal Info Management** - Edit bio, contact details, social links
- **GitHub Integration** - Auto-sync projects from your GitHub profile
- **Manual Projects** - Add/edit/delete custom projects
- **CV Management** - Manage experiences, education, and skills
- **LinkedIn Import** - Import CV data from LinkedIn (JSON/CSV/ZIP)
- **Drag & Drop** - Reorder items with intuitive interface
- **Cache Control** - Manage GitHub API rate limits

---

## 🛠️ Tech Stack

### **Core**
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Database**: PostgreSQL with Drizzle ORM

### **UI & Components**
- **Component Library**: Radix UI primitives
- **UI Toolkit**: shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **WebGL**: Vanta.js (fluid background)

### **State & Data**
- **State Management**: Zustand
- **Form Handling**: React hooks + Zod validation
- **API**: Next.js Server Actions & Route Handlers

### **Utilities**
- **Drag & Drop**: @dnd-kit
- **File Processing**: JSZip (for LinkedIn imports)
- **Internationalization**: Custom Zustand store

---

## 📦 Database Schema

The application uses **PostgreSQL** with the following main tables:

### **Tables**
- `personal_info` - Bio, contact info, social links
- `projects` - GitHub & manual projects with metadata
- `cv_experiences` - Work experience entries
- `cv_education` - Education history
- `cv_skills` - Skills by category and level
- `settings` - App configuration

### **Features**
- Full CRUD operations via admin panel
- Order management with drag-and-drop
- Visibility toggles for projects
- Soft deletes with timestamps

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 20+ (LTS recommended)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** 14+ (local or remote)

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/Norethion/my-portfolio.git
cd my-portfolio
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

# Run migrations
npx drizzle-kit push

# Or generate and run migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

5. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Admin Panel Access

1. **Press `Ctrl+K`** anywhere on the site
2. **Enter your admin password** (from `.env.local`)
3. **Click "Login"**

### **Admin Panel Sections**

#### **👤 Personal Information**
- Name, job title, bio (TR/EN)
- Contact details (email, phone, location)
- Social media links (GitHub, LinkedIn, Twitter, etc.)
- Avatar URL
- Languages spoken

#### **💼 Projects Management**
- **GitHub Sync**: Auto-fetch projects from your GitHub profile
- **Manual Projects**: Add custom projects with descriptions
- **Visibility Toggle**: Show/hide specific projects
- **Reordering**: Drag and drop to sort projects
- **Cache Management**: Control GitHub API usage

#### **📄 CV Management**
- **Experience**: Add/edit/delete work experience
- **Education**: Manage academic background
- **Skills**: Categorize and rank skills
- **Import**: Bulk import from LinkedIn exports

---

## 🌐 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click **Add New Project**
- Import your GitHub repository

3. **Add Environment Variables:**
In Vercel dashboard → Settings → Environment Variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXT_PUBLIC_ADMIN_KEY` - Your admin password
- `GITHUB_USERNAME` - Your GitHub username (optional)
- `GITHUB_TOKEN` - Your GitHub token (optional)

4. **Deploy!**
Click **Deploy** and wait for build to complete.

**For detailed deployment instructions, see:**
- 📘 [Deployment Guide (English)](docs/DEPLOYMENT.md)
- 📘 [Kurulum Rehberi (Türkçe)](docs/DEPLOYMENT_TR.md)

### **Database Options**

#### **Option 1: Vercel Postgres**
- Integrated with Vercel
- Automatic connection pooling
- Easy setup

#### **Option 2: Supabase** (Recommended)
- Free tier: 500MB database
- Real-time capabilities
- Built-in authentication
- **See**: [Detailed Supabase Setup](docs/DEPLOYMENT.md#supabase-setup)

#### **Option 3: Other Providers**
- Neon, Railway, AWS RDS, or any PostgreSQL-compatible database

---

## 📁 Project Structure

```
my-portfolio/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   └── dashboard/            # Main admin dashboard
│   ├── api/                      # API routes
│   │   ├── admin/                # Protected admin APIs
│   │   ├── cv/                   # CV data APIs
│   │   ├── personal-info/        # Personal info APIs
│   │   └── projects/             # Projects APIs
│   ├── contact/                  # Contact page
│   ├── cv/                       # CV/resume page
│   ├── projects/                 # Projects listing page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── admin/                    # Admin components
│   ├── effects/                  # WebGL & animations
│   ├── layout/                   # Layout components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities & config
│   ├── db/                       # Database setup
│   │   ├── drizzle.ts           # DB client
│   │   └── schema.ts            # Drizzle schema
│   └── utils/                    # Helper functions
├── stores/                       # Zustand stores
│   ├── language.ts              # Language switcher
│   └── theme.ts                 # Theme switcher
├── public/                       # Static assets
├── drizzle/                      # Database migrations
├── .env.local                    # Environment variables
├── drizzle.config.ts             # Drizzle config
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── package.json                  # Dependencies
```

---

## 🎯 Key Features Explained

### **GitHub Integration**
Automatically syncs your GitHub repositories to showcase your work:

- Fetches public repositories
- Extracts metadata (stars, topics, language)
- Supports rate limiting with caching
- Manual override available

### **LinkedIn Import**
Import your professional data in multiple formats:

- **JSON**: Full profile export
- **CSV**: Spreadsheet format
- **ZIP**: Complete export archive

Automatically maps and imports experiences, education, and skills.

### **Responsive Design**
Mobile-first approach ensures perfect display on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)

---

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx drizzle-kit push              # Push schema changes
npx drizzle-kit generate          # Generate migrations
npx drizzle-kit migrate           # Run migrations
npx drizzle-kit studio            # Open Drizzle Studio

# Linting
npm run lint         # Run ESLint
```

### **Code Style**
- ESLint for code quality
- TypeScript for type safety
- Prettier-ready formatting

---

## 📚 Documentation

### **Quick Links**
- 📖 [Setup Guide (English)](docs/SETUP.md)
- 📖 [Setup Rehberi (Türkçe)](docs/SETUP_TR.md)
- 🚀 [Deployment Guide (English)](docs/DEPLOYMENT.md)
- 🚀 [Dağıtım Rehberi (Türkçe)](docs/DEPLOYMENT_TR.md)
- 🌐 [Multi-Language Guide](docs/MULTI_LANGUAGE.md)

---

## 🤝 Contributing

This is a personal portfolio project. Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

See [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Norethion**

- 💼 [LinkedIn](https://www.linkedin.com/in/ali-enes-aydemir-42207a229/)
- 🐙 [GitHub](https://github.com/Norethion)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **shadcn** - Beautiful UI components
- **Vercel** - Hosting platform
- **Supabase** - Database platform
- **Drizzle ORM** - Type-safe ORM
- **All Contributors** - Thanks for your support!

---

## 📈 Future Enhancements

- [ ] CV PDF export feature
- [ ] Contact form backend integration (Resend/SendGrid)
- [ ] Advanced analytics dashboard
- [ ] Blog section with MDX
- [ ] Performance optimizations
- [ ] WebRTC video call integration
- [ ] AI-powered project recommendations

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using Next.js, TypeScript, and PostgreSQL

</div>
