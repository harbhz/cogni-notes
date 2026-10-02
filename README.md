# Cogni Notes

Cogni Notes is a private workspace for capturing thoughts and asking an AI
assistant questions about your notes. It combines a Next.js application with
Supabase authentication, Prisma/PostgreSQL persistence, and OpenAI-powered
responses.

## Features

- Create, edit, search, and delete personal notes.
- Autosave note edits with visible save status.
- Ask questions across your saved notes in a focused AI workspace.
- Light and dark themes with a responsive desktop sidebar.
- Account-aware data access so notes remain private to their owner.

## Getting Started

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local` for PostgreSQL, Supabase, and OpenAI. Never
commit `.env.local` or any other file containing credentials.

Generate the Prisma client and start the development server:

```bash
npx prisma generate
npm run dev
```

Open <http://localhost:3000> in your browser.

## Environment

The required values are listed in `.env.example`:

- `DATABASE_URL` for the PostgreSQL database.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for auth.
- `OPENAI_API_KEY` for the AI assistant.

Keep `.env.local` private and configure the same variables in Vercel for
production.

## Database

Database migrations are managed with Prisma. Review generated migrations
before applying changes to a shared database.

```bash
npm run migrate
```

## Checks

```bash
npm run lint
npm run build
```

## Deployment

Configure the same environment variables in the deployment platform, then use
`npm run build` and `npm start` for a production deployment.