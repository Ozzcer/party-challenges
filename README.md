# Party Challenges

A party game platform where players join via a code, compete in solo and adversarial challenges, and earn attribute-based scores. Admins manage the game through a dedicated panel.

## Stack

- **API** — Fastify, Prisma (SQLite), JWT auth
- **Frontend** — SvelteKit, Svelte 5

## Getting started

Run from project root
```bash
npm install
npm run dev
```

## TODO

- [ ] **Event structure** — Challenges are grouped under named Events (name, description). Players are enrolled in an event, and challenge instances are scoped to it
  - [ ] Schema: add `Event` model (id, name, description, current, createdAt, updatedAt) — only one event may have `current = true`, enforced in service logic
  - [ ] Schema: add `EventPlayer` junction model (eventId, playerId, @@unique)
  - [ ] Schema: add `eventId` (required) to `ChallengeInstance`
  - [ ] Schema: add `eventId` (required) to `PlayerAttributeScore` — scores are scoped per event
  - [ ] Schema: run and verify migration
  - [ ] API: `event.service.ts` — createEvent (sets current, clears flag on others if ticked), listEvents, getEvent (with players + instances), getCurrentEvent
  - [ ] API: `event.service.ts` — updateEvent (name, description, current) — setting current clears the flag on all other events
  - [ ] API: `event.service.ts` — enrollPlayerInCurrentEvent(playerId) — called on player login, no-op if already enrolled
  - [ ] API: admin routes — `POST /admin/events`, `GET /admin/events`, `GET /admin/events/:id`, `PATCH /admin/events/:id`
  - [ ] API: update player login to auto-enroll player in the current event
  - [ ] API: update `admin.service.ts` getOverview to pull counts from the current event only
  - [ ] FE: admin event list page — shows all events with player + instance counts, highlights current
  - [ ] FE: admin create event form — name, description, current toggle
  - [ ] FE: admin event detail page — enrolled players, challenge instances and their statuses; inline edit for name, description, and current flag
  - [ ] _(Future Goal)_ API + FE: score migration — copy scores from a past event into a new one with an optional multiplier
- [ ] **Admin: create challenges** — Admins can create challenges tied to an attribute, with a description, score value, and type (solo/adversarial)
- [ ] **Admin: assign players to challenges** — Admins can create challenge instances within an event and assign one or more players to them
- [ ] **Admin: resolve challenges** — Admins mark a challenge instance as complete or failed; for adversarial challenges a winner is selected. Score is applied to the relevant player attribute on completion
- [x] **Player login** — Players enter their unique code, then set their name on first login
  - [x] API: player auth guard — `player.auth.guard.ts`, validates JWT role is `player`, mirrors admin guard
  - [x] API: player routes — `player.routes.ts`, scoped group with player auth guard as preHandler, registered under `/public` prefix
  - [x] API: `PATCH /public/me/name` — sets name on the authenticated player, returns 400 if name already set
  - [x] API: `player.service.ts` — setPlayerName(playerId, name)
  - [x] FE: `/login` page — player code entry form, calls `POST /public/login`, stores nameRequired from response
  - [x] FE: `/set-name` page — shown after login if nameRequired, calls `PATCH /public/me/name`, redirects to player landing on success
  - [x] FE: redirect to `/set-name` after login if nameRequired, else redirect to player landing
- [ ] **Leaderboards** — Per-attribute leaderboard ranked by score, plus an overall leaderboard based on average score across all attributes
- [ ] **Player landing: entity** — Players can view their linked entity (character/avatar), determined by their attribute scores
- [ ] **Player landing: attributes** — Players can view their current attribute scores
- [ ] **Player landing: challenge history** — Players can view past challenges, outcome, and score gained
- [ ] **Admin: manage players** — View all players, see their scores, remove or reset a player
- [ ] **Admin: event overview** — See all active challenge instances in an event, their status (open/completed/failed), and which players are involved
- [ ] **Player: active challenges** — Players can see challenges currently assigned to them and their status
- [ ] **Entity reveal** — Entity is hidden until a score threshold is reached, adding a discovery mechanic