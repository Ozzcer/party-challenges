import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private readonly authService = inject(AuthService);

  protected readonly homeLink = toSignal(
    this.authService.user$.pipe(map(user => (user?.role === 'admin' ? '/admin' : '/'))),
    { initialValue: '/' },
  );
}
