<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Install dependencies with `npm ci`. The app is Next.js 16 and expects Node `^20.19`, `^22.12`, or `>=24` (this environment uses Node 22).
- PostgreSQL 16 is part of the environment. On boot the start script starts the cluster, creates the `origin` role and database when missing, appends local defaults to `.env` only for keys that are absent, runs `npx prisma migrate deploy`, and starts `npm run dev` on port 3000 (`http://localhost:3000`). Re-running start is safe when that port is already open.
- Local database URL when `DATABASE_URL` is unset: `postgresql://origin:origin@127.0.0.1:5432/origin`. Check it with `npx tsx test-db.ts` and `npx tsx test-prisma.ts`.
- Portfolio pages and `/firstoflast` render with placeholder Supabase values. Collection, gallery, and admin auth call a real Supabase project, so set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for those flows. Contact delivery also needs `EMAIL_USER`, `EMAIL_PASS`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, and `WHATSAPP_TO`.
- Checks: `npm run lint` (the tree currently has existing ESLint errors), `npm run build` (includes TypeScript). There is no test script.
