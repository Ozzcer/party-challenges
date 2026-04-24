import { Routes } from '@angular/router';
import { publicAuthGuard } from '../core/guards/public-auth.guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
    canActivate: [publicAuthGuard],
  },
];
