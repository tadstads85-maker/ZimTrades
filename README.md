# ZimTrades

ZimTrades - Modern African marketplace

This repository contains the initial scaffold for ZimTrades (web + api) with authentication (NextAuth) and Stripe subscription integration (test mode).

Quick start (local)

1. Install dependencies

   pnpm install

2. Copy environment variables

   cp .env.example .env

   Fill in DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

3. Start services with Docker Compose (dev)

   docker-compose up --build

4. Run Prisma migrations & generate client

   pnpm --filter "*" prisma migrate dev --name init

5. Open web app

   http://localhost:3000

Notes
- NextAuth is configured in the web app (apps/web) and uses Prisma adapter. The database is at DATABASE_URL.
- Stripe integration (checkout + webhooks) is implemented in the API (apps/api). Use Stripe test keys for now.
- This scaffold uses pnpm workspaces and TypeScript.

What's included
- Monorepo layout: apps/web (Next.js), apps/api (NestJS)
- Prisma schema (prisma/schema.prisma)
- Docker Compose for local dev (postgres, redis, web, api)
- NextAuth (email/password + Google OAuth sample)
- Stripe webhook handler skeleton
- CI: GitHub Actions workflow (basic lint & build)

Next steps
- Add your Stripe & OAuth app credentials
- Run migrations and create an initial admin user
- Continue with marketplace, listings, chat, video

