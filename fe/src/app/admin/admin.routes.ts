import { Routes } from '@angular/router';
import { adminAuthGuard } from '../core/guards/admin-auth.guard';
import { adminNoAuthGuard } from '../core/guards/admin-no-auth.guard';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminLogin } from './admin-login/admin-login.component';
import { AssignChallengeComponent } from './challenges/assign-challenge/assign-challenge.component';
import { ChallengeListComponent } from './challenges/challenge-list/challenge-list.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { ResolveChallengeComponent } from './challenges/resolve-challenge/resolve-challenge.component';
import { LandingComponent } from './landing/landing.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { PlayerComponent } from './players/player/player.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: AdminLogin,
    canActivate: [adminNoAuthGuard],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [adminAuthGuard],
        children: [
          { path: '', component: LandingComponent },
          {
            path: 'players',
            children: [
              { path: '', component: PlayerListComponent },
              { path: ':id', component: PlayerComponent },
            ],
          },
          {
            path: 'challenges',
            children: [
              { path: '', component: ChallengeListComponent },
              {
                path: 'create',
                component: CreateChallengeComponent,
              },
              {
                path: ':id',
                children: [
                  { path: 'assign', component: AssignChallengeComponent },
                  { path: 'resolve', component: ResolveChallengeComponent },
                  { path: '**', redirectTo: '/admin/challenges' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
