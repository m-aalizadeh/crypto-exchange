# Crypto Exchange

A modern, responsive cryptocurrency exchange web application built with React, TypeScript, and Vite. It provides real-time market data visualization, multi-language support, and a clean, component-driven UI.

## Features

- 📈 **Real-time data & charts** — live market updates via Socket.IO, with interactive charts (Chart.js / Recharts)
- 🌍 **Internationalization** — multi-language support powered by i18next with automatic language detection
- 🎨 **Modern UI** — built with Tailwind CSS and Material Tailwind components, plus smooth animations via Framer Motion
- 📋 **Data tables** — sortable, filterable tables using React Table
- ✅ **Forms & validation** — React Hook Form with Google reCAPTCHA integration
- 🔔 **Notifications** — toast notifications with React Hot Toast
- 🧭 **Routing** — client-side navigation with React Router
- 🔒 **Type-safe** — fully written in TypeScript

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Material Tailwind, Framer Motion |
| Data & State | Axios, Socket.IO Client |
| Charts | Chart.js, Recharts |
| Forms | React Hook Form, React Google reCAPTCHA |
| Tables | React Table |
| Routing | React Router DOM |
| i18n | i18next, react-i18next |
| Icons | Lucide React, Heroicons, React Icons |
| Tooling | ESLint, PostCSS, Autoprefixer |

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/m-aalizadeh/crypto-exchange.git
cd crypto-exchange

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required variables (e.g. API base URL, reCAPTCHA site key, socket server URL):

```env
VITE_API_BASE_URL=
VITE_SOCKET_URL=
VITE_RECAPTCHA_SITE_KEY=
```

### Running the App

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run linter
npm run lint
```

The app will be available at `http://localhost:5173` by default.

## Project Structure

```
crypto-exchange/
├── public/          # Static assets
├── src/             # Application source code
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route-level views
│   ├── ...
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

> Note: adjust the structure above to match your actual `src/` folder layout.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

## License

This project is currently unlicensed. Add a `LICENSE` file to specify usage terms if you plan to open source it.
