# Superheroes Monorepo

A full-stack application to manage a list of superheroes.

**Frontend:** https://superheroes-frontend-zeta.vercel.app/

**API Endpoint:** https://superheroes-bj5n.onrender.com/api/superheroes

## Tech Stack

### Frontend

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **TanStack Query (React Query)** - Data fetching and caching
- **Zod** - Schema validation
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling and animations
- **Shadcn/ui** - UI components
- **Axios** - HTTP client
- **ESLint & Prettier** - Code quality and formatting
- **Husky & lint-staged** - Git hooks
- **Vite** - Build tool

### Backend

- **Express** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database (hosted on Neon)
- **TypeScript** - Type safety
- **Zod** - Schema validation

### Deployment

- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Render (auto-deploy from GitHub)
- **Database**: Neon PostgreSQL (serverless)

## Features

- Create, read, update, delete superheroes
- Multiple image URLs per hero with preview
- Search by nickname (substring matching)
- Pagination (5 heroes per page)
- Optimistic updates for better UX
- Responsive design with smooth animations
- Form validation with error messages
- Image error handling with fallbacks

## Setup

1. Install dependencies:

```bash
  pnpm install
```

2. Set up environment:
  Open .env.example in
  apps/backend/
  and paste your password in the DATABASE_URL "password" field

```bash
  DATABASE_URL="postgresql://postgres:password@localhost:5432/superheroes_db"
```

3. Run migrations:

```bash
  pnpm db:migrate
```

if need to fill the database with data:

```bash
  pnpm db:seed
```

```bash
  DATABASE_URL="postgresql://postgres:password@localhost:5432/superheroes_db"
```

4. Start the frontend and backend:

```bash
  pnpm run dev
```

5. Open http://localhost:5173 in your browser to see the app.

## Servers:

- Frontend: http://localhost:5173
- Backend: http://localhost:3005/api/superheroes

## API Endpoints

```bash
  GET /api/superheroes - List heroes (paginated)
  GET /api/superheroes/:id - Get single hero
  POST /api/superheroes - Create hero
  PUT /api/superheroes/:id - Update hero
  DELETE /api/superheroes/:id - Delete hero
  GET /health - Health check
```
