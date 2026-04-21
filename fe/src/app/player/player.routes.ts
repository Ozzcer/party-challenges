import { Routes } from '@angular/router';
import { playerAuthGuard } from '../core/guards/player-auth.guard';
import { playerNoAuthGuard } from '../core/guards/player-no-auth.guard';
import { playerSetupGuard } from '../core/guards/player-setup.guard';

export const PLAYER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./player-layout.component').then(m => m.PlayerLayoutComponent),
    canActivate: [playerAuthGuard],
    children: [
      {
        path: '',
        canActivate: [playerSetupGuard],
        loadComponent: () =>
          import('./landing/landing.component').then(m => m.LandingComponent),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [playerNoAuthGuard],
    loadComponent: () =>
      import('./player-login/player-login.component').then(m => m.PlayerLoginComponent),
  },
  {
    path: 'set-name',
    canActivate: [playerAuthGuard],
    loadComponent: () =>
      import('./set-name/set-name.component').then(m => m.SetNameComponent),
  },
];
