# Foodies - NextJS Recipe Sharing Application

This project is a food and recipe sharing application built with Next.js and TailwindCSS.

## Project Structure

```
Project
├── app
│   ├── community
│   │   └── page.tsx
│   ├── meals
│   │   ├── [mealSlug]
│   │   │   └── page.tsx
│   │   ├── share
│   │   │   ├── error.tsx
│   │   │   └── page.tsx
│   │   ├── loading-out.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── error.tsx
│   ├── global.css
│   ├── icon.png
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.module.css
│   └── page.tsx
├── assets
│   ├── icons
│   │   ├── community.png
│   │   ├── event.png
│   │   └── meal.png
│   ├── burger.jpg
│   └── curry.jpg
├── components
│   ├── images
│   │   └── image-slideshow.tsx
│   ├── main-header
│   │   ├── main-header.background.tsx
│   │   ├── main-header.tsx
│   │   └── nav-link.tsx
│   └── meals
│       ├── image-picker.tsx
│       ├── meal-item.tsx
│       ├── meals-form-submit.tsx
│       └── meals-grid.tsx
├── lib
│   ├── actions.ts
│   └── meals.ts
└── public
    └── images
        ├── burger.jpg
        └── curry.jpg
```

## Prerequisites

- Node.js v23.x or later
- npm v10.x or later

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd NextJS-foodies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure TailwindCSS

If the TailwindCSS configuration files are not present, create them manually:

**tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4. Configure your database

This project uses better-sqlite3. Make sure your database is properly set up according to the requirements in lib/meals.ts.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TailwindCSS Setup Notes

If you encounter issues with TailwindCSS directives not being recognized, try these steps:

1. Make sure your global.css includes the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Rest of your styles... */
```

2. If using Node v23 causes compatibility issues with TailwindCSS v4, consider:
   - Downgrading to TailwindCSS v3: `npm install -D tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.16`
   - Or using Node v20 LTS if possible

## Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Shadcn
- better-sqlite3
- framer-motion
- react-hook-form
- slugify
- xss (for security)
