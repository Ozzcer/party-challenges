import { Routes } from '@angular/router';
import { adminAuthGuard } from '../core/guards/admin-auth.guard';
import { AdminLayoutComponent } from './admin-layout.component';
import { LandingComponent } from './landing/landing.component';
import { PlayersComponent } from './players/players.component';
import { PlayerComponent } from './players/player/player.component';
import { ChallengesComponent } from './challenges/challenges.component';
import { AssignComponent } from './challenges/assign/assign.component';
import { ResolveComponent } from './challenges/resolve/resolve.component';

export const ADMIN_ROUTES: Routes = [
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
              { path: '', component: PlayersComponent },
              { path: ':id', component: PlayerComponent },
            ],
          },
          {
            path: 'challenges',
            children: [
              { path: '', component: ChallengesComponent },
              {
                path: ':id',
                children: [
                  { path: 'assign', component: AssignComponent },
                  { path: 'resolve', component: ResolveComponent },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
