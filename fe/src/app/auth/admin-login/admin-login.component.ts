import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLogin {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  result = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    this.authService.adminLogin(username!, password!).subscribe(res => {
      if (res.success) {
        this.router.navigateByUrl('/admin');
      } else {
        this.result.set(res.error.message);
      }
    });
  }
}
