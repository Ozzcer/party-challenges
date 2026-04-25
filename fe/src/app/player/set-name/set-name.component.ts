import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player/player.service';

@Component({
  selector: 'app-set-name',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './set-name.component.html',
  styleUrl: './set-name.component.scss',
})
export class SetNameComponent {
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  error = signal('');

  submit(): void {
    if (this.form.invalid) return;

    this.playerService.setName(this.form.value.name!).subscribe((res) => {
      console.log('here', res);
      if (res.success) {
        this.router.navigateByUrl('/');
      } else {
        this.error.set(res.error.message);
      }
    });
  }
}
