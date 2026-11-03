<p align="center" style="color: #95EDA9 ; font-weight: bold; font-size: 3em;">SkillAtlas</p>

<p align="center">
  <strong>The open marketplace and registry for AI Agent Skills.</strong>
</p>

---

## Features

- **Marketplace & Discovery**: Browse, filter, and search agent skills across multiple categories.
- **GitHub Import**: Import any public GitHub repository directly into a skill draft.
- **Auto-Generated `SKILL.md`**: Automatically creates a standard skill specification from your repository README.
- **Creator Studio**: Edit code and documentation in an integrated web editor, manage versions, and publish.
- **Real Database Telemetry**: Live metrics for downloads, stars, and verified skills directly from PostgreSQL.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **Auth & Storage**: JWT authentication, PostgreSQL database, GitHub REST API

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [PostgreSQL](https://www.postgresql.org/) (v15+)

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillatlas?schema=public"
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

Run database migrations and start the server:

```bash
npx prisma migrate dev
npm start
```

The backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
SkillAtlas/
├── backend/          # Express API, Prisma schema, and business modules
│   ├── prisma/       # Database schema & migrations
│   └── src/          # Modules (auth, skills, marketplace, github)
└── frontend/         # Next.js web application
    ├── public/       # Static assets & logo
    └── src/          # Pages (App Router), components, & API clients
```

---
