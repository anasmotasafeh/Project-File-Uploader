# AGENTS.md

## Quick start

```bash
cp .env.example .env    # then fill in DATABASE_URL, SECRET, PORT
npm install
npx prisma migrate dev
npm run dev             # node --watch (NOT nodemon)
```

## Key facts

- **Module system**: ESM (`"type": "module"`). Always use `import`/`export`.
- **Entrypoint**: `server.js` → `src/app.js`. `server.js` is currently empty.
- **Database**: PostgreSQL via Prisma. Import from `generated/prisma/client.js` (custom output path in `schema.prisma`).
- **Session store**: `import connectPgSimple from "connect-pg-simple"` backed by `import pg from "pg"; const pool = new pg.Pool(...)`. The README falsely claims `@quixo3/prisma-session-store`.
- **Auth**: `passport.use(new Strategy({ usernameField: "email" }, verifyCallback))`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | `node --watch server.js` (built-in watch) |
| `npm start` | `node server.js` |
| `npx prisma migrate dev` | Create/apply migration |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | GUI DB browser |

No test/lint/format/typecheck tools are configured.

## Known inconsistencies (fix before depending on these)

- `src/config/passport.js` does `import { getUserByEmail, getUserById } from "../models/User.js"` — file does not exist. Export them from `src/services/userService.js` instead.
- `src/app.js` does `import pool from "./db/pool.js"` — file does not exist. Needs `import pg from "pg"; const pool = new pg.Pool(...)` exported from there.
- `src/app.js` also imports 6 route modules (`signUp`, `logIn`, `logOut`, `membershipRouter`, `newMessageRouter`, `deleteMessageRouter`) — none exist yet.
- Many source files are stubs (empty): `server.js`, `src/routes/index.js`, `src/middleware/errorHandler.js`, `src/middleware/notFound.js`, `src/utils/catchAsync.js`, `src/config/env.js`.
- `src/controllers/`, `src/views/`, `src/public/` contain only `.gitkeep`.
- `.env.example` is empty. Populate with `DATABASE_URL`, `SECRET`, `PORT` (default 3000).

## Architecture conventions

- **Controllers**: `import { someService } from "../services/someService.js"` — req/res only, delegate to services.
- **Services**: `import { prisma } from "../../lib/prisma.js"` — business logic + Prisma queries.
- **Routes**: `import { Router } from "express"` — mount route files centrally in `src/routes/index.js`.
- **Async handlers**: `import { catchAsync } from "../utils/catchAsync.js"` — wrap async route handlers.
- **Errors**: `throw new Error(...)` or `next(err)` → caught by `import { errorHandler } from "../middleware/errorHandler.js"`.
