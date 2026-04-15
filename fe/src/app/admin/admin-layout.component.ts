import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/admin/login');
    });
  }
}
