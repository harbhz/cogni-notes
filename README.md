This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Cogni Notes

Cogni Notes is a Next.js app for saving notes and asking an AI assistant
questions about them. Authentication is handled by Supabase, notes are stored
with Prisma and PostgreSQL, and AI responses use OpenAI.

## Getting Started

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local` for PostgreSQL, Supabase, and OpenAI. Never
commit `.env.local` or any other file containing credentials.

Generate the Prisma client and start the development server:

npm run dev
# or
yarn dev
```

Open <http://localhost:3000> in your browser.

## Checks

```bash
npm run lint
npm run build
```

Database migrations are managed with Prisma. Review generated migrations
before applying changes to a shared database.

## Deployment

Configure the same environment variables in the deployment platform, then use
`npm run build` and `npm start` for a production deployment.
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
