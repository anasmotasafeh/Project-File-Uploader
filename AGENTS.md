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
- **Session store**: `@quixo3/prisma-session-store` backed by Prisma (see `src/app.js:7,25`). Uses the `Session` model in `schema.prisma`.
- **Auth**: `passport.use(new Strategy({ usernameField: "email" }, verifyCallback))` in `src/config/passport.js`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | `node --watch server.js` (built-in watch) |
| `npm start` | `node server.js` |
| `npx prisma migrate dev` | Create/apply migration |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | GUI DB browser |

No test/lint/format/typecheck tools are configured.

## Known issues (fix before depending on these)

- `src/routes/index.js` references undefined variables (`signinRouter`, `loginRouter`, `logoutRouter`) — need to be imported from route files that don't exist yet.
- `src/utils/catchAsync.js`, `src/middleware/errorHandler.js`, `src/middleware/notFound.js`, `src/config/env.js` are empty stubs.
- `server.js` is empty — needs `import "./src/app.js"` and a listen call.
- `src/controllers/`, `src/views/`, `src/public/` contain only `.gitkeep`.
- `.env.example` is empty. Populate with `DATABASE_URL`, `SECRET`, `PORT` (default 3000).
- `src/services/userService.js` does named import `{ prisma }` but `lib/prisma.js` exports default — should be `import prisma from "../../lib/prisma.js"`.
- `src/config/passport.js` imports `bcrypt` but `package.json` has `bcryptjs` — should be `import bcrypt from "bcryptjs"`.
- Unused dependencies in `package.json`: `connect-pg-simple`, `helmet`, `morgan`, `connect-flash` (installed but not imported anywhere).

## Architecture conventions

- **Controllers**: `import { someService } from "../services/someService.js"` — req/res only, delegate to services.
- **Services**: `import prisma from "../../lib/prisma.js"` — business logic + Prisma queries.
- **Routes**: `import { Router } from "express"` — mount route files centrally in `src/routes/index.js`.
- **Async handlers**: `import { catchAsync } from "../utils/catchAsync.js"` — wrap async route handlers.
- **Errors**: `throw new Error(...)` or `next(err)` → caught by `import { errorHandler } from "../middleware/errorHandler.js"`.

## Prisma client

The Prisma client lives at `lib/prisma.js` and exports a default `PrismaClient` instance configured with `@prisma/adapter-pg`. Import as:
```js
import prisma from "../lib/prisma.js";
```

## Models

- **User**: `id` (Int), `name`, `email` (unique), `password`, `folders`, `files`, `createdAt`
- **Folder**: `id`, `name`, `user` (→ User), `files`, `createdAt`
- **File**: `id`, `name`, `url`, `folder` (→ Folder), `user` (→ User), `createdAt`
- **Session**: `id`, `sid` (unique), `data`, `expiresAt` — managed by `@quixo3/prisma-session-store`
