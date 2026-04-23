import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AdminEventService } from '../../core/services/admin/admin-event.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadSignalDirective } from '../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-landing',
  imports: [LoadSignalDirective],
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.component.scss',
})
export class AdminLandingComponent {
  public readonly currentEvent = toSignal(inject(AdminEventService).getCurrentEvent());

  public readonly user = toSignal(
    inject(AuthService).user$.pipe(
      map((user) => {
        if (user.role !== 'admin') throw new Error('Player user expected');
        return user;
      }),
    ),
    { requireSync: true },
  );
}
