import { Routes } from '@angular/router';
import { adminAuthGuard } from '../core/guards/admin-auth.guard';
import { adminNoAuthGuard } from '../core/guards/admin-no-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [adminNoAuthGuard],
    loadComponent: () =>
      import('./admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        canActivate: [adminAuthGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./landing/admin-landing.component').then((m) => m.AdminLandingComponent),
          },
          {
            path: 'players',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./players/player-list/player-list.component').then(
                    (m) => m.PlayerListComponent,
                  ),
              },
              {
                path: ':id',
                loadComponent: () =>
                  import('./players/player/player.component').then((m) => m.PlayerComponent),
              },
            ],
          },
          {
            path: 'challenges',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./challenges/challenge-list/challenge-list.component').then(
                    (m) => m.ChallengeListComponent,
                  ),
              },
              {
                path: 'create',
                loadComponent: () =>
                  import('./challenges/create-challenge/create-challenge.component').then(
                    (m) => m.CreateChallengeComponent,
                  ),
              },
              {
                path: ':id',
                children: [{ path: '**', redirectTo: '/admin/challenges' }],
              },
            ],
          },
          {
            path: 'challenge-instances/:id/resolve',
            loadComponent: () =>
              import('./challenges/resolve-challenge/resolve-challenge.component').then(
                (m) => m.ResolveChallengeComponent,
              ),
          },
        ],
      },
    ],
  },
];
