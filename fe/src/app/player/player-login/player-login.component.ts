import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-player-login',
  imports: [ReactiveFormsModule],
  templateUrl: './player-login.component.html',
  styleUrl: './player-login.component.scss',
})
export class PlayerLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    playerCode: new FormControl('', Validators.required),
  });

  error = signal('');

  login(): void {
    if (this.form.invalid) return;

    this.authService.publicLogin(this.form.value.playerCode!).subscribe(res => {
      if (res.success) {
        this.router.navigateByUrl('/');
      } else {
        this.error.set(res.error.message);
      }
    });
  }
}
