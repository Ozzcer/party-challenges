import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminPlayerService } from '../core/services/admin/admin-player.service';
import { AuthService } from '../core/services/auth.service';
@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly adminPlayerService = inject(AdminPlayerService);
  private readonly router = inject(Router);

  protected readonly searchForm = new FormGroup({
    playerCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
