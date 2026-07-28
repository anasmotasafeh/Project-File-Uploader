# Express + Prisma + Passport Starter Template

A reusable starter template for building Express.js applications with Prisma ORM and Passport.js authentication (session-based, backed by a Prisma session store).

## Features

- **Express** app with clean separation of concerns (controllers, services, routes, middleware)
- **Prisma ORM** for database access, with a singleton client instance
- **Passport.js** local strategy for session-based authentication
- **express-session** + `@quixo3/prisma-session-store` to persist sessions in the database (no in-memory sessions)
- **Helmet** and **Morgan** for basic security headers and request logging
- Centralized error handling and a 404 handler
- ESM (`import`/`export`) syntax throughout
- `nodemon` for local development

## Folder Structure

```
express-template/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Generated migration history
├── generated/
│   └── prisma/             # Custom Prisma Client output (see schema.prisma)
├── lib/
│   └── prisma.js           # PrismaClient singleton — import this everywhere
├── src/
│   ├── config/
│   │   ├── env.js          # Centralized process.env access/validation
│   │   └── passport.js     # Passport strategies + serialize/deserialize
│   ├── controllers/        # Request/response handlers (no business logic)
│   ├── services/           # Business logic + Prisma queries
│   ├── middleware/
│   │   ├── ensureAuth.js   # Route guard (req.isAuthenticated())
│   │   ├── errorHandler.js # Centralized error handler
│   │   └── notFound.js     # 404 handler
│   ├── routes/
│   │   └── index.js        # Mounts all route files
│   ├── utils/
│   │   └── catchAsync.js   # Wraps async route handlers
│   ├── public/              # Static assets (CSS, client-side JS)
│   ├── views/                # Server-rendered templates (EJS/Pug), if used
│   └── app.js               # Express app setup (middleware, routes)
├── tests/                   # Test files
├── .env                      # Local environment variables (not committed)
├── .env.example               # Template for required env vars
├── .gitignore
├── prisma.config.js
├── package.json
├── README.md
└── server.js                  # Entry point — imports app.js and starts listening
```

> **Note on empty folders:** Git doesn't track empty directories. Folders like `controllers/`, `services/`, or `views/` may contain a placeholder `.gitkeep` file until real code is added — feel free to delete `.gitkeep` once a folder has real files in it.

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd express-template
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mydb?schema=public"
SESSION_SECRET="a-long-random-string"
PORT=3000
```

If you don't have Postgres running locally, you can spin one up quickly with Docker:

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 3. Set up the database

Define your models in `prisma/schema.prisma`, then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This template expects (at minimum) a `Session` model for `@quixo3/prisma-session-store`:

```prisma
model Session {
  id        String   @id
  sid       String   @unique
  data      String
  expiresAt DateTime
}
```

### 4. Run the app

```bash
npm run dev     # starts with nodemon (auto-restarts on changes)
npm start       # starts normally (production)
```

The server will be running at `http://localhost:3000` (or whatever `PORT` you set).

### 5. (Optional) Browse your database

```bash
npx prisma studio
```

## Available Scripts

| Script                  | Description                                  |
|--------------------------|-----------------------------------------------|
| `npm run dev`            | Start the app with nodemon (auto-reload)      |
| `npm start`               | Start the app normally                        |
| `npx prisma migrate dev` | Create/apply a new migration                  |
| `npx prisma studio`       | Open Prisma's GUI database browser            |
| `npx prisma generate`     | Regenerate the Prisma Client                  |

## Authentication

This template uses **session-based authentication** via Passport's local strategy:

- Sessions are stored in the database (not in memory), using `@quixo3/prisma-session-store`, so they survive server restarts and work across multiple instances.
- `src/config/passport.js` defines the `LocalStrategy` and `serializeUser`/`deserializeUser`.
- `src/middleware/ensureAuth.js` protects routes that require a logged-in user:

```js
import { ensureAuth } from "../middleware/ensureAuth.js";

router.get("/dashboard", ensureAuth, dashboardController);
```

## Project Conventions

- **Controllers** only handle `req`/`res` — no direct Prisma calls. Delegate to a service.
- **Services** contain business logic and Prisma queries, and are reusable outside of HTTP handlers (e.g., in scripts or background jobs).
- **Routes** are split by resource (e.g., `authRoutes.js`, `folderRoutes.js`) and mounted centrally in `src/routes/index.js`.
- **Errors** should be thrown or passed to `next(err)` — they'll be caught by `src/middleware/errorHandler.js`.
- **Async route handlers** should be wrapped in `catchAsync` to avoid repetitive try/catch blocks:

```js
import { catchAsync } from "../utils/catchAsync.js";

router.get("/", catchAsync(async (req, res) => {
  const data = await someService.getData();
  res.json(data);
}));
```

## Using This Template for a New Project

1. Click "Use this template" (or clone it) and rename the project in `package.json`.
2. Delete any unused folders (`views/`/`public/` if building an API-only backend).
3. Update `prisma/schema.prisma` with your actual data models.
4. Run `npx prisma migrate dev --name init` to create your first migration.
5. Remove this section of the README and write project-specific documentation.

## License

MIT (or update as needed)