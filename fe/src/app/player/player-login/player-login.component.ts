import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-player-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './player-login.component.html',
  styleUrl: './player-login.component.scss',
})
export class PlayerLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  form = new FormGroup({
    playerCode: new FormControl('', Validators.required),
  });

  error = signal('');

  login(): void {
    if (this.form.invalid) return;
    this.loadingService.showLoader();
    this.authService.publicLogin(this.form.value.playerCode!).subscribe((res) => {
      if (res.success) {
        this.router.navigateByUrl('/');
      } else {
        this.error.set(res.error.message);
      }
    });
  }
}
