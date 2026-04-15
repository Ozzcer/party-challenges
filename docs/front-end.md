# Frontend

## Routes

### Player (`/`)

| Path | Component | Guard | Purpose |
|------|-----------|-------|---------|
| `/` | `LandingComponent` | `playerSetupGuard` | Player dashboard — current stats, completed challenges, and any ongoing challenge |
| `/login` | `PlayerLoginComponent` | `playerNoAuthGuard` | Player login via player code |
| `/set-name` | `SetNameComponent` | `playerAuthGuard` | Player sets their display name (prompted after first login) |

### Public (`/public`)

| Path | Component | Guard | Purpose |
|------|-----------|-------|---------|
| `/public/leaderboard` | `LeaderboardComponent` | none | Attribute leaderboards — visible to anyone |

### Admin (`/admin`)

| Path | Component | Guard | Purpose |
|------|-----------|-------|---------|
| `/admin/login` | `AdminLogin` | `adminNoAuthGuard` | Admin login with username and password |
| `/admin` | `LandingComponent` | `adminAuthGuard` | Admin dashboard |
| `/admin/players` | `PlayerListComponent` | `adminAuthGuard` | List all players in the current event |
| `/admin/players/:id` | `PlayerComponent` | `adminAuthGuard` | Individual player detail |
| `/admin/challenges` | `ChallengeListComponent` | `adminAuthGuard` | List all challenges |
| `/admin/challenges/:id/assign` | `AssignChallengeComponent` | `adminAuthGuard` | Assign a challenge to a player |
| `/admin/challenges/:id/resolve` | `ResolveChallengeComponent` | `adminAuthGuard` | Resolve/score a completed challenge |

---

## Services

| Service | Path | Purpose |
|---------|------|---------|
| `ApiService` | `core/services/api.service.ts` | Base HTTP wrapper — all requests go through here, returns `ApiResult<T>` discriminated union |
| `AuthService` | `core/services/auth.service.ts` | Admin and player login, logout, get current session user |
| `AdminPlayerService` | `core/services/admin/player.service.ts` | View and manage player data (Admin only) |
| `PlayerService` | `core/services/player/player.service.ts` | Fetch player data and manage own data (Player only) |
| `LeaderboardService` | `core/services/public/leaderboard.service.ts` | Fetch all leaderboards |
