import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  error = signal('');

  login(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    this.authService.adminLogin(username!, password!).subscribe(res => {
      if (res.success) {
        this.router.navigateByUrl('/admin');
      } else {
        this.error.set(res.error.message);
      }
    });
  }
}
