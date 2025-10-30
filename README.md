# My Portfolio

A modern personal portfolio website built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI** - Clean, minimal design with light/dark mode toggle
- 🌐 **Multi-language** - TR/EN language support
- 🔐 **Hidden Admin Panel** - Access via `Ctrl+Alt+A` keyboard shortcut
- 📱 **Responsive** - Works on all devices
- ✨ **WebGL Effects** - Interactive fluid background animation
- 📄 **CV Generator** - Generate and download CV as PDF
- 📧 **Contact Form** - Get in touch with visitors

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Internationalization**: next-i18next
- **Font**: Poppins
- **PDF Generation**: @react-pdf/renderer

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Norethion/my-portfolio.git
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_ADMIN_KEY=your-admin-password-here
GITHUB_USERNAME=Norethion
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-portfolio/
├── app/                  # Next.js App Router pages
│   ├── admin/           # Admin dashboard
│   ├── projects/        # Projects page
│   ├── cv/              # CV page
│   └── contact/         # Contact page
├── components/          # React components
│   ├── admin/           # Admin components
│   ├── layout/          # Layout components
│   ├── ui/              # UI components
│   └── effects/         # WebGL effects
├── lib/                 # Utilities
├── stores/              # Zustand stores
├── public/              # Static assets
└── data/                # Database/data files
```

## Admin Access

To access the admin panel:

1. Press `Ctrl+Alt+A` anywhere on the site
2. Enter the admin password (set in `.env.local`)
3. Click "Login"

The admin panel allows you to:
- Manage personal information
- Add/edit projects
- Update CV content

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_ADMIN_KEY`: Your admin password
   - `GITHUB_USERNAME`: Your GitHub username
4. Deploy!

The site will be live at `https://your-project.vercel.app`

### Database

Currently using file-based storage. For production, consider:
- PostgreSQL
- MongoDB
- Supabase
- Vercel Postgres

## Future Enhancements

- [ ] GitHub API integration for projects
- [ ] SQLite database for content management
- [ ] Admin panel CRUD operations
- [ ] CV PDF generation
- [ ] Contact form backend integration
- [ ] SEO optimization
- [ ] Performance optimization

## License

MIT

## Author

**Norethion**

## Contributing

This is a personal portfolio. Contributions are welcome but please open an issue first to discuss any changes.

## Support

For questions or issues, please open an issue on GitHub.
