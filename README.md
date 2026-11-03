<p align="center">
  <img src="frontend/public/logo.png" alt="SkillAtlas Logo" width="130" />
</p>

<h1 align="center">SkillAtlas</h1>

<p align="center">
  <strong>The Open Marketplace &amp; Registry for Autonomous AI Agent Skills</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture--tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#github-import">GitHub Import</a> •
  <a href="#skill-specification">SKILL.md Spec</a> •
  <a href="#api-reference">API Reference</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-20232A?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-7.9-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-ISC-emerald?style=flat-square" alt="License" />
</p>

---

## Overview

**SkillAtlas** is a developer-first marketplace, registry, and execution platform for AI Agent Skills, tools, and prompts. Designed for the agentic era, SkillAtlas bridges the gap between AI developers and agent runtimes (Google Antigravity, MCP, Cursor, Claude, custom LangChain / LlamaIndex agents).

Whether importing an open-source toolchain from GitHub or engineering custom skills directly inside the integrated web studio, SkillAtlas handles versioning, validation, distribution, and community governance.

---

## ✨ Features

- **⚡ Real-Time Telemetry & Zero Fake Metrics**: All counts, ratings, reviews, and install metrics reflect live database state directly computed from PostgreSQL.
- **🌐 Universal Public GitHub Import**: Seamlessly import **any public GitHub repository** into an editable draft skill. No personal access token required for public repositories.
- **🤖 Automatic `SKILL.md` Synthesis**: If a public repository lacks a native `SKILL.md` specification, SkillAtlas automatically synthesizes one from the repository's `README.md`, metadata, and code structure.
- **🎨 Dark Obsidian & Emerald UI**: Minimalist, high-density interface crafted with Tailwind CSS v4, Radix UI primitives, Lucide icons, and zero AI clutter.
- **💻 Integrated Creator Studio**: Full-featured in-browser IDE powered by Monaco Editor, multi-file workspace navigator, live markdown preview, and version management.
- **📦 SemVer Release Workflow**: Publish skills with atomic version control (`v1.0.0`, `v1.1.0`), release branches, and instant runtime distribution.
- **🛡️ Multi-Tier Role Governance**: Granular role-based authorization (`USER`, `CREATOR`, `ADMIN`) with automated creator onboarding upon initial skill creation or import.
- **🔍 Deep Search & Discovery**: Filter across categories (Development, DevOps, AI/ML, Data, Security, Productivity, Creative) with multi-criteria sorting (popularity, newest, ratings).
- **📋 One-Click CLI Installation**: Copy instant terminal install snippets (`npx skillatlas install <slug>`) or clone snapshots directly into agent workspaces.

---

## 🏗️ Architecture & Tech Stack

```
SkillAtlas/
├── backend/                   # REST API & Business Logic (Express 5 + Prisma)
│   ├── prisma/                # Schema definitions & PostgreSQL migrations
│   └── src/
│       ├── app/               # Express app instance, server setup, & routes
│       ├── middlewares/       # Auth, validation (Zod), & error handlers
│       ├── modules/
│       │   ├── admin/         # Platform administration & moderation
│       │   ├── auth/          # JWT auth, refresh tokens, Google OAuth
│       │   ├── engagement/    # Reviews, stars, collections, & installs
│       │   ├── github/        # GitHub API client, tree parser, & importer
│       │   ├── marketplace/   # Discovery, query filters, & live telemetry
│       │   ├── skills/        # Skill CRUD, multi-file versions, & publishing
│       │   └── user/          # Profiles, role escalation, & settings
│       └── utils/             # ApiError, ApiResponse, logger
│
└── frontend/                  # Modern Web Application (Next.js 16 + React 19)
    ├── public/                # Static assets, logos, and icons
    └── src/
        ├── app/               # App Router pages & route groups
        │   ├── (admin)/       # Platform management & skill review queues
        │   ├── (auth)/        # Login, registration, password recovery
        │   ├── (dashboard)/   # Creator studio, editor, GitHub import, telemetry
        │   └── (public)/      # Marketplace explore, skill details, docs, blog
        ├── components/        # Reusable UI primitives (Radix) & feature widgets
        ├── constants/         # Categories, navigation, & configuration
        ├── lib/               # API clients, auth context, & query providers
        └── types/             # TypeScript domain types & API contracts
```

### Core Technologies

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16.3.4 (App Router & Turbopack), React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, Monaco Editor, Radix UI, Sonner |
| **Backend** | Node.js, Express.js 5.2, Prisma ORM 7.9, PostgreSQL 16+, Zod, JWT (Access + Refresh), Passport.js |
| **Integrations** | GitHub REST API v3, Brevo (Email verification & password reset), Google OAuth 2.0 |

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or later
- **PostgreSQL**: `v15` or later running locally or via cloud (Neon, Supabase, etc.)
- **Git**

---

### 1. Database & Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` with your database credentials and secrets:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/skillatlas?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# Optional Integrations
GITHUB_TOKEN=your_optional_github_pat_for_higher_rate_limits
BREVO_API_KEY=your_brevo_api_key_for_transactional_emails
EMAIL_FROM=no-reply@skillatlas.dev
```

Run Prisma migrations and start the backend:

```bash
# Push database schema or run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npm run prisma:generate

# Start the API server in development mode
npm run start
```

The backend server will start on `http://localhost:5000`.

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Ensure `frontend/.env.local` points to your backend API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐙 Public GitHub Import

SkillAtlas allows creators to import **any public GitHub repository**:

1. Navigate to **Dashboard → Import from GitHub** (`/github-import`).
2. Paste the URL of any public repository (e.g. `https://github.com/octocat/Hello-World` or any agent tool repo).
3. The server inspects repository branches and parses the file tree without requiring personal access tokens.
4. Select up to 50 files (code files, scripts, documentation) to package into your skill snapshot.
5. If no `SKILL.md` exists in the repository, SkillAtlas automatically synthesizes one based on the repository's `README.md` and metadata.
6. Click **Import as Draft** — your account is automatically elevated to Creator status and you are redirected to the Creator Studio to edit and publish your version.

---

## 📄 SKILL.md Specification

Every skill on SkillAtlas packages an RFC-compliant `SKILL.md` specification file in its root directory:

```markdown
---
name: github-code-reviewer
description: Automated code review agent that inspects diffs and suggests improvements.
version: 1.0.0
category: development
tags:
  - git
  - review
  - agents
---

# GitHub Code Reviewer

Automated code review agent capable of analyzing unified diffs, running linting checks, and outputting formatted inline comments.

## Capabilities
- Inspect git pull requests and branches
- Synthesize actionable code change suggestions
- Verify conformance against standard code guidelines

## Usage
Include this skill within your agent configuration:
```bash
npx skillatlas install github-code-reviewer
```
```

---

## 📡 API Reference Summary

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server uptime and health probe | None |
| `GET` | `/api/marketplace` | Query published skills with filters | None |
| `GET` | `/api/marketplace/stats` | Live platform telemetry (skills, creators, downloads) | None |
| `GET` | `/api/skills/:slug` | Retrieve skill details and active version | None |
| `POST` | `/api/github/inspect` | Inspect public GitHub repo & branches | None |
| `GET` | `/api/github/tree` | Fetch recursive git tree for branch | None |
| `POST` | `/api/github/import` | Import selected files into a draft skill | Bearer Token |
| `POST` | `/api/auth/register` | Register new user account | None |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | None |
| `POST` | `/api/auth/refresh` | Refresh expired access token | Refresh Token |
| `GET` | `/api/auth/me` | Fetch active user session | Bearer Token |
| `POST` | `/api/skills` | Create new draft skill | Creator |
| `PUT` | `/api/skills/:id` | Update skill metadata | Creator / Owner |
| `POST` | `/api/skills/:id/versions` | Publish new skill version | Creator / Owner |
| `GET` | `/api/admin/skills` | List all platform skills for review | Admin |

---

## 🧪 Testing & Verification

```bash
# Frontend Type Checking
npx --prefix frontend tsc --project frontend/tsconfig.json --noEmit

# Frontend Production Build
npm --prefix frontend run build

# Backend Syntax & Route Verification
node -e "import('./backend/src/app/app.js').then(() => console.log('Backend OK'));"
```

---

## 📄 License

SkillAtlas is licensed under the [ISC License](LICENSE).
