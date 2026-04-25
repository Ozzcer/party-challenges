import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LoadingService } from '../core/services/loading.service';

@Component({
  selector: 'app-player-layout',
  imports: [RouterOutlet, RouterLink, MatButtonModule],
  templateUrl: './player-layout.component.html',
  styleUrl: './player-layout.component.scss',
})
export class PlayerLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  logout(): void {
    this.loadingService.showLoader();
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
