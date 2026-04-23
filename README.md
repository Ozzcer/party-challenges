# Party Challenges

A party game platform where players join via a code, compete in solo and adversarial challenges, and earn attribute-based scores. Admins manage the game through a dedicated panel.

## Stack

- **API** — Fastify, Prisma (SQLite), JWT auth via httpOnly cookie
- **Frontend** — Angular 21, TailwindCSS 4, RxJS
- **Shared** — `@party/shared` package for domain types (generated from Prisma + hand-written response shapes)

## Getting Started

```bash
npm install
npm start       # starts API + FE concurrently
```

API runs on `localhost:3000`, FE on `localhost:4200` (proxied to API via `/api`).

## Docs

- [`docs/api.md`](docs/api.md) — API architecture, auth, route groups, error handling
- [`docs/front-end.md`](docs/front-end.md) — FE routes, services, shared types
- [`docs/data-models.md`](docs/data-models.md) — Prisma data models

## TODO
- Add admin + player layout to not found if logged in?
- add search by name for admins
- move images out of project
