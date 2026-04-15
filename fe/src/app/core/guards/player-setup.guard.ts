import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const playerSetupGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // TODO this should fetch the player details, ensuring they have a name and a are enrolled with the current event.
  // If not registered, logout and redirect to login
  // If no name, redirect to set name component

  return authService.getUser().pipe(
    map(result => result.success && result.result.role === 'player'
      ? true
      : router.createUrlTree(['/login'])
    ),
  );
};
