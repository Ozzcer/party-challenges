# API

## Stack

- **Fastify** — HTTP server
- **Prisma** — ORM (SQLite)
- **JWT** — auth via httpOnly cookie (`token`)
- **`json-schema-to-ts`** — request/response schema typing
- **`@party/shared`** — shared domain types

## Auth

Auth is JWT-based, stored in an httpOnly cookie. Three guard hooks enforce access:

| Hook | File | Requirement |
|------|------|-------------|
| `adminAuthGuard` | `hooks/admin-auth.guard.ts` | Valid JWT with `role === 'admin'` |
| `playerAuthGuard` | `hooks/player-auth.guard.ts` | Valid JWT with `role === 'player'` |
| `publicAuthGuard` | `hooks/public-auth.guard.ts` | Valid JWT (any role) |

Guards are applied at the route group level via `preHandler` hooks.

## Route Groups

| Prefix | Guard | Purpose |
|--------|-------|---------|
| `/admin/*` | `adminAuthGuard` | Admin-only management routes |
| `/player/*` | `playerAuthGuard` | Authenticated player routes |
| `/public/*` | `publicAuthGuard` | Any authenticated user (e.g. leaderboard) |
| `/auth/*` | none | Login, logout, session |

## Routes

### Auth (`/auth`)

| Method | Path | Body | Response | Purpose |
|--------|------|------|----------|---------|
| `POST` | `/admin/login` | `{ username, password }` | `204` | Admin login, sets JWT cookie |
| `POST` | `/public/login` | `{ playerCode }` | `{ nameRequired: boolean }` | Player login, sets JWT cookie |
| `GET` | `/auth/logout` | — | `204` | Clears JWT cookie |
| `GET` | `/auth/me` | — | `User` | Returns current session user |

### Admin (`/admin`)

> Shell — routes to be implemented

### Player (`/player`)

> Shell — routes to be implemented

### Public (`/public`)

> Shell — routes to be implemented

---

## Response Types

All routes must define a response schema. Routes under `/player` and `/public` that return DB model data must use `Protected*` types from `@party/shared` to prevent sensitive field leakage (e.g. `playerCode`, `password`).

See `shared/src/protected.model.ts` for all available protected types.

## Project Structure

```
src/
├── routes/       # Route registration (one file per group)
├── controllers/  # Request handlers (keep thin, call services)
├── services/     # Business logic and DB queries via Prisma
├── hooks/        # Auth guards (preHandler hooks)
├── schema/       # JSON Schema definitions for request/response validation
├── lib/          # Utilities (error handler, prisma client, hashing)
└── generated/
    └── prisma/   # Prisma generated client (gitignored, do not edit)
```

## Error Handling

All errors go through `lib/error-handler.lib.ts`. Throw `AppError` for expected errors:

```typescript
throw new AppError('Invalid credentials', 401);
throw new AppError('Not found', 404);
```

Unhandled errors are caught and returned as a generic 500. The `ApiError` shape is defined in `@party/shared` and used by the FE to handle error responses.
