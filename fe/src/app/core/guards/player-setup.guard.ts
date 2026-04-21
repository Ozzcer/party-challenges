import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player/player.service';

export const playerSetupGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const playerService = inject(PlayerService);
  const router = inject(Router);

  return authService.getUser().pipe(
    switchMap((userResult) => {
      if (!userResult.success) return [router.createUrlTree(['/login'])];
      if (!userResult.result.name) return [router.createUrlTree(['/set-name'])];

      return playerService.isEnrolledInCurrentEvent().pipe(
        map((result) => {
          if (result.success && result.result) return true;
          authService.logout().subscribe();
          return router.createUrlTree(['/login']);
        }),
      );
    }),
  );
};
