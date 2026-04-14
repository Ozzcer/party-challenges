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
- [ ] **Admin: create challenges** — Admins can create challenges tied to an attribute, with a description, score value, and type (solo/adversarial)
- [ ] **Admin: assign players to challenges** — Admins can create challenge instances within an event and assign one or more players to them
- [ ] **Admin: resolve challenges** — Admins mark a challenge instance as complete or failed; for adversarial challenges a winner is selected. Score is applied to the relevant player attribute on completion
- [ ] **Player login** — Players enter their unique code, then set their name on first login
- [ ] **Leaderboards** — Per-attribute leaderboard ranked by score, plus an overall leaderboard based on average score across all attributes
- [ ] **Player landing: entity** — Players can view their linked entity (character/avatar), determined by their attribute scores
- [ ] **Player landing: attributes** — Players can view their current attribute scores
- [ ] **Player landing: challenge history** — Players can view past challenges, outcome, and score gained
- [ ] **Admin: manage players** — View all players, see their scores, remove or reset a player
- [ ] **Admin: event overview** — See all active challenge instances in an event, their status (open/completed/failed), and which players are involved
- [ ] **Player: active challenges** — Players can see challenges currently assigned to them and their status
- [ ] **Entity reveal** — Entity is hidden until a score threshold is reached, adding a discovery mechanic