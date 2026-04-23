import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeType } from '@party/shared';
import { firstValueFrom } from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-create-challenge',
  imports: [ReactiveFormsModule],
  templateUrl: './create-challenge.component.html',
  styleUrl: './create-challenge.component.scss',
})
export class CreateChallengeComponent {
  private readonly challengeService = inject(AdminChallengeService);
  private readonly dialogService = inject(DialogService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly challengeTypes: ChallengeType[] = ['SOLO', 'ADVERSARIAL'];

  public readonly attributes = toSignal(this.challengeService.getAttributes());

  public readonly form = this.formBuilder.group({
    description: ['', Validators.required],
    score: [null as number | null, [Validators.required, Validators.min(1)]],
    type: ['' as ChallengeType | '', Validators.required],
    attributeId: [null as number | null, Validators.required],
  });

  public readonly submitError = signal<string | null>(null);

  public async createChallenge(): Promise<void> {
    if (this.form.invalid) return;

    const confirmed = await this.dialogService.showConfirmDialog(
      'Are you sure you wish to create this challenge?',
    );
    if (!confirmed) return;

    const value = this.form.getRawValue();
    const result = await firstValueFrom(
      this.challengeService.createChallenge({
        description: value.description!,
        score: value.score!,
        type: value.type as ChallengeType,
        attributeId: value.attributeId!,
      }),
    );

    if (result.success) {
      const playerCodes = this.route.snapshot.queryParamMap.getAll('playerCodes');
      this.router.navigate(['/admin/challenges'], {
        queryParams: { playerCodes },
      });
    } else {
      this.submitError.set(result.error.message);
    }
  }
}
