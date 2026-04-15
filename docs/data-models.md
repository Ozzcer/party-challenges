# Data Models

Defined in `api/prisma/schema.prisma`. TypeScript interfaces are auto-generated into `shared/src/generated.ts` via `npx prisma generate` — do not edit that file manually.

## Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `ChallengeType` | `SOLO`, `ADVERSARIAL` | Whether a challenge involves one player or two competing |
| `ChallengeStatus` | `OPEN`, `COMPLETED`, `FAILED` | Outcome of a player's challenge participation |
| `TitleType` | `SINGLE_REQUIREMENT`, `MULTI_REQUIREMENT_AVERAGE` | How a title's attribute thresholds are evaluated |

---

## Models

### `Admin`
System administrator account.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `username` | `String` | Unique |
| `password` | `String` | Hashed — never expose via API |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `Player`
A participant in the game. `playerCode` is used to log in and should never be exposed to other players.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `name` | `String?` | Optional until set via `/player/set-name` |
| `playerCode` | `String` | Unique login code — never expose via player/public routes |
| `challengeParticipation` | `ChallengeParticipant[]` | |
| `playerAttributeScores` | `PlayerAttributeScore[]` | |
| `events` | `GameEventPlayer[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `GameEvent`
A single running instance of the game (e.g. one party night). Only one event should have `current = true` at a time.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `name` | `String` | |
| `description` | `String` | |
| `current` | `Boolean` | Whether this is the active event |
| `players` | `GameEventPlayer[]` | |
| `challengeInstances` | `ChallengeInstance[]` | |
| `playerAttributeScores` | `PlayerAttributeScore[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `GameEventPlayer`
Join table linking a `Player` to a `GameEvent`. A player must be enrolled in an event to participate.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `eventId` | `Int` | FK → `GameEvent` |
| `playerId` | `Int` | FK → `Player` |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Unique constraint: `(eventId, playerId)`

---

### `Attribute`
A scoring category (e.g. Strength, Wit). Challenges are linked to an attribute, and completing them increases the player's score in that attribute.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `name` | `String` | Unique |
| `description` | `String` | |
| `challenges` | `Challenge[]` | |
| `entityAttributes` | `TitleRequirement[]` | |
| `playerAttributeScores` | `PlayerAttributeScore[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `PlayerAttributeScore`
Tracks a player's score in a specific attribute for a specific event.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `playerId` | `Int` | FK → `Player` |
| `attributeId` | `Int` | FK → `Attribute` |
| `eventId` | `Int` | FK → `GameEvent` |
| `score` | `Int` | Default `0` |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Unique constraint: `(playerId, attributeId, eventId)`

---

### `Challenge`
A challenge template. Can be standard or custom (`custom = true`). Completing it awards `score` points in the linked `Attribute`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `description` | `String` | |
| `score` | `Int` | Points awarded on completion |
| `type` | `ChallengeType` | `SOLO` or `ADVERSARIAL` |
| `custom` | `Boolean` | Admin-created one-off challenge |
| `attributeId` | `Int` | FK → `Attribute` |
| `instances` | `ChallengeInstance[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `ChallengeInstance`
A specific occurrence of a `Challenge` within an event. An admin assigns a challenge to player(s), creating an instance.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `challengeId` | `Int` | FK → `Challenge` |
| `eventId` | `Int` | FK → `GameEvent` |
| `participants` | `ChallengeParticipant[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `ChallengeParticipant`
Links a `Player` to a `ChallengeInstance` with a status tracking their outcome.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `playerId` | `Int` | FK → `Player` |
| `instanceId` | `Int` | FK → `ChallengeInstance` |
| `status` | `ChallengeStatus` | Default `OPEN` |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Unique constraint: `(playerId, instanceId)`

---

### `Title`
An achievement unlocked when a player's attribute scores meet the defined requirements.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `name` | `String` | |
| `imageUrl` | `String?` | Optional badge image |
| `description` | `String` | |
| `titleType` | `TitleType` | How requirements are evaluated |
| `requirements` | `TitleRequirement[]` | |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `TitleRequirement`
A threshold on a specific `Attribute` that must be met to unlock a `Title`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `Int` | PK |
| `titleId` | `Int` | FK → `Title` |
| `attributeId` | `Int` | FK → `Attribute` |
| `threshold` | `Int` | Minimum score required |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

Unique constraint: `(titleId, attributeId)`
