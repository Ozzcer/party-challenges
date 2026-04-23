import { Component, inject } from '@angular/core';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-create-challenge',
  imports: [],
  templateUrl: './create-challenge.component.html',
  styleUrl: './create-challenge.component.scss',
})
export class CreateChallengeComponent {
  private readonly challengeService = inject(AdminChallengeService);
  private readonly dialogService = inject(DialogService);

  public async createChallenge(): Promise<void> {
    const confirm = await this.dialogService.showConfirmDialog(
      'Are you sure you wish to create this challenge?',
    );
    if (!confirm) return;
  }
}
