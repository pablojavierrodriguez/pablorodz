# /pablorodz — Personal Website & Systems Monograph

> **Open-source digital presence, living system index, and architectural chronicle of Pablo Javier Rodríguez (Solutions Architect & Digital Products Builder).**

[![Production Website](https://img.shields.io/badge/Live_Site-pablorodz.vercel.app-emerald?style=for-the-badge&logo=vercel&logoColor=white)](https://pablorodz.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pablorodz-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pablojavierrodriguez/pablorodz)

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

🌐 **Live Production Application:** [https://pablorodz.vercel.app](https://pablorodz.vercel.app)  
📦 **Source Repository:** [https://github.com/pablojavierrodriguez/pablorodz](https://github.com/pablojavierrodriguez/pablorodz)

---

## 🏛️ Architectural Overview

This repository hosts the personal website and portfolio for **Pablo Javier Rodríguez**. Unlike conventional developer portfolios or generic landing pages, it is designed as an **Architectural Monograph & Living System Index** that showcases systems thinking, product depth, and engineering leadership.

### Key Capabilities

- **Living System Index:** A curated, interactive index of public open-source tools ([`gripm`](https://github.com/pablojavierrodriguez/gripm), [`gripm-playbook`](https://github.com/pablojavierrodriguez/gripm-playbook)), private enterprise systems (`c3admin`), and incubating projects (`DOM`).
- **Dual-Lens Toggle:** Allows visitors to view every system from either a **Product Lens** (value proposition, operational impact, and live demo) or an **Architecture Lens** (system topology schematic, full tech stack, and protocol contracts).
- **Architectural Chronicle:** A career trajectory structured around systems built, transformations led, and measurable operational outcomes (e.g., Telecom / Personal OSS ecosystem serving 130K+ incidents/month, +30% automation, -25% MTTR).
- **Universal Design Pillars:** Four foundational principles for resilient, vendor-independent, human-and-machine-friendly digital products.
- **Native Bilingual i18n (ES / EN):** Automatic browser language detection with persistent client toggle and Spanish fallback.
- **Live Dynamic Telemetry:** Real-time GitHub stars and npm download metrics aggregated via edge endpoint (`/api/live-stats`) with stale-while-revalidate caching and graceful resilience fallbacks.
- **Single Source of Truth (`lib/content.ts`):** All professional data, project specifications, career roles, and credentials are decoupled from the presentation layer.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.4 | App Router with Turbopack, Partial Prerendering & Cache Components |
| **UI Library** | React 19.3 + TypeScript 5 | Strict types, modular component topology |
| **Styling** | Tailwind CSS v4 | CSS variables, responsive design, dark-mode-first aesthetic |
| **Icons** | Lucide React | Tree-shaken SVG iconography |
| **Typography** | Geist Sans & Geist Mono | Variable font families via `next/font` |
| **i18n** | Custom React 19 Context | `useSyncExternalStore` persistent state, `?lang=en\|es` query parameter support |
| **Hosting** | Vercel Edge Network | Serverless runtime for dynamic live telemetry & edge caching |

---

## 🌐 Hosting & Deployment Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │       https://github.com/pablojavierrodriguez/pablorodz │
                    │                     (Source Repository)                │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼  Continuous Deployment (main)
                    ┌────────────────────────────────────────────────────────┐
                    │             https://pablorodz.vercel.app               │
                    │               (Production Next.js 16)                  │
                    ├───────────────────────────┬────────────────────────────┤
                    │   Static Pre-rendered UI  │  Edge Serverless APIs      │
                    │   - Dual-Lens System Index│  - /api/live-stats         │
                    │   - Architectural Archive │  - /opengraph-image        │
                    │   - Bilingual Monograph   │  - /sitemap.xml            │
                    └───────────────────────────┴────────────────────────────┘
```

- **Primary Production Environment:** Deployed on [Vercel](https://vercel.com) (`https://pablorodz.vercel.app`) with full serverless runtime support for dynamic edge API endpoints (`/api/live-stats`), dynamic OpenGraph generation (`/opengraph-image`, `/twitter-image`), and edge caching.
- **Branch Strategy:**
  - `main`: Production-ready, verified releases deployed directly to Vercel.
  - `dev`: Active development and feature staging branch.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20.0.0`
- npm (or pnpm / yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pablojavierrodriguez/pablorodz.git
   cd pablorodz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Test

```bash
# Compile optimized production bundle
npm run build

# Start local production server
npm run start
```

---

## 🔒 Privacy & Architecture Notes

- **Sovereign Backlog:** The agile backlog managed via [Gripm](https://github.com/pablojavierrodriguez/gripm) is intentionally kept local-first and excluded from version control via `.gitignore` (`/backlog`, `.gripm`).
- **Private Systems:** For proprietary enterprise projects (`c3admin`), the site displays public architectural blueprints, topology schemas, and verified outcomes without exposing proprietary codebases or private APIs.

---

## 👤 Author

**Pablo Javier Rodríguez**  
*Solutions Architect & Digital Products Builder*

- **Website:** [https://pablorodz.vercel.app](https://pablorodz.vercel.app)
- **GitHub:** [@pablojavierrodriguez](https://github.com/pablojavierrodriguez)
- **LinkedIn:** [/in/pablojavierrodriguez](https://www.linkedin.com/in/pablojavierrodriguez)
- **Email:** [pabjrodriguez@gmail.com](mailto:pabjrodriguez@gmail.com)
- **Location:** Argentina (ART, UTC-3)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
