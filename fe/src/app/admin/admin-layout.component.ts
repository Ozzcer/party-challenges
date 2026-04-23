import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { AdminPlayerService } from '../core/services/admin/player.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly adminPlayerService = inject(AdminPlayerService);
  private readonly router = inject(Router);

  protected readonly searchForm = new FormGroup({
    playerCode: new FormControl('', { nonNullable: true }),
  });
  protected readonly searchError = signal<string | null>(null);

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/admin/login');
    });
  }

  searchByCode(): void {
    const code = this.searchForm.controls.playerCode.value.trim();
    if (!code) return;

    this.searchError.set(null);
    this.adminPlayerService.getPlayerIdByCode(code).subscribe((result) => {
      if (result.success) {
        this.searchForm.reset();
        this.router.navigateByUrl('/admin/players/' + result.result);
      } else {
        this.searchError.set('Player not found');
      }
    });
  }
}
