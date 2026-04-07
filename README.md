# Architect Studio - Premium Architectural Website

A modern, elegant website for an Indian-based architect studio featuring dynamic content management capabilities.

## Features

- **Elegant Design**: Inspired by top architectural websites with luxury aesthetics
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Dynamic Content**: Admin panel for managing portfolio, testimonials, and blog posts
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, and Framer Motion
- **Performance Optimized**: Fast loading with optimized images and animations

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js, MongoDB
- **Authentication**: NextAuth.js
- **File Upload**: Multer with Cloudinary integration
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
architect-site/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes
│   │   ├── blog/           # Blog pages
│   │   ├── portfolio/      # Portfolio pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- npm (comes with Node.js)
- MongoDB (Optional - for future admin features)
- Cloudinary account (Optional - for image uploads)

### Installation

#### Step 1: Install Node.js (if not already installed)

**Windows:**
- Download Node.js LTS from [nodejs.org](https://nodejs.org/)
- Run the installer and follow the prompts
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**macOS:**
```bash
# Using Homebrew
brew install node
```

**Linux:**
```bash
# Using apt (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm
```

#### Step 2: Install Project Dependencies

```bash
# Navigate to the project directory
cd architect-studio

# Install all dependencies
npm install
```

#### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` and configure as needed. For basic setup, you can leave most values empty.

#### Step 4: Run Development Server

```bash
npm run dev
```

The site will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

#### Step 5: Build for Production

```bash
npm run build
npm start
```

## Admin Panel

Access the admin panel at `/admin` to manage:
- Portfolio projects
- Testimonials
- Blog posts
- Contact form submissions
- Site settings

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:
- Email: info@architectstudio.com
- Website: https://architectstudio.com