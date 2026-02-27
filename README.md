# 💜 To my Kitten - Valentine's Day 3D Experience

A beautiful, interactive 3D Valentine's Day website with animated hearts, particle effects, and modern web technologies.

![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/loveyou/ci-cd.yml?branch=main&style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-latest-black?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### Visual Effects

- **3D Heart Animations** - Beautiful, deeply extruded 3D hearts floating in space
- **Particle Explosions** - Click hearts to create stunning particle bursts with physics
- **Parallax Camera** - Scene responds to mouse/touch movement for depth effect
- **Background Stars** - Twinkling starfield with additive blending
- **Bloom & Vignette** - Post-processing effects for cinematic look
- **Gradient Text** - Animated typing effect with gradient colors

### Interactivity

- **Clickable Hearts** - Each heart explodes into particles when clicked, with soft cursor-driven motion that keeps them easy to pop
- **Hover Effects** - Hearts glow and scale up on hover
- **Sound Effects** - Subtle pop sounds on heart clicks (Web Audio API)
- **Touch Support** - Full mobile touch interaction support

### Design

- **Dark Theme** - Elegant dark background (#121212 → #1e1e1e)
- **Purple Accents** - Beautiful purple color palette (#9c27b0, #ba68c8, #ce93d8)
- **Custom Fonts** - Dancing Script & Pacifico for elegant typography
- **Responsive** - Fully responsive design for all screen sizes

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/loveyou.git
cd loveyou

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

## 📦 Build Instructions

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory.

## 🌐 Deployment

### GitHub Pages (Automatic via CI/CD)

This project uses GitHub Actions for automatic deployment:

1. Push to the `main` branch
2. GitHub Actions will automatically:
   - Install dependencies
   - Run ESLint for code quality
   - Run TypeScript type checking
   - Build the production bundle
   - Deploy to GitHub Pages

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy dist/ folder to your hosting
# For GitHub Pages, you can use gh-pages package:
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

## 🔧 CI/CD Workflow

The project includes a complete CI/CD pipeline configured in `.github/workflows/ci-cd.yml`:

### Pipeline Steps

1. **Checkout** - Clone the repository
2. **Setup Node.js** - Configure Node.js environment with caching
3. **Install Dependencies** - Clean install using `npm ci`
4. **Lint** - Run ESLint for code quality checks
5. **Type Check** - Run TypeScript compiler in noEmit mode
6. **Build** - Create optimized production build
7. **Upload Artifact** - Store build output for deployment
8. **Deploy** - Push to GitHub Pages (on main branch only)

### Workflow Triggers

- **Push to main** - Full build and deploy
- **Pull Request** - Build and test (no deploy)

### Environment

- Ubuntu latest runner
- Node.js 20
- GitHub Pages environment with write permissions

## 📁 Project Structure

```
loveyou/
├── .github/workflows/
│   └── ci-cd.yml          # CI/CD pipeline configuration
├── src/
│   ├── components/
│   │   ├── Heart3D.tsx    # 3D heart component with Three.js
│   │   ├── HeartScene.tsx # Main 3D scene manager
│   │   ├── ExplosionParticle.tsx  # Particle explosion effect
│   │   ├── StarField.tsx  # Background star field
│   │   ├── TypingText.tsx # Animated typing text effect
│   │   └── Layout.tsx     # Main layout component
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles with Tailwind
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## 🎨 Technologies Used

| Technology                 | Purpose                     |
| -------------------------- | --------------------------- |
| React 19                   | UI Framework                |
| TypeScript                 | Type-safe development       |
| Vite                       | Build tool & dev server     |
| Tailwind CSS v4            | Utility-first styling       |
| Three.js                   | 3D graphics rendering       |
| React Three Fiber          | React renderer for Three.js |
| React Three Drei           | Useful helpers for R3F      |
| React Three Postprocessing | Post-processing effects     |

## 🎮 Controls

| Action        | Desktop    | Mobile              |
| ------------- | ---------- | ------------------- |
| View parallax | Move mouse | Tilt device / Touch |
| Explode heart | Click      | Tap                 |
| Rotate scene  | Mouse move | Swipe               |

## 🔄 v2 Visual Improvements

- Faster, more expressive synchronized color shifting of all hearts in purple tones
- Enhanced 3D depth of hearts through updated geometry, materials, and lighting
- Softer cursor interaction: hearts gently react to the cursor without escaping clicks
- Slightly richer cursor trail and more dynamic, but lightweight, particle explosions

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📱 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

WebGL 2.0 support required for 3D effects.

## 📝 License

This project is created with love 💜

---

**Made with ❤️ for my Kitten**
