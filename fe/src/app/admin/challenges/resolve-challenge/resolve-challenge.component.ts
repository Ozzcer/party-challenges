import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProtectedPlayer } from '@party/shared';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-resolve-challenge',
  imports: [LoadSignalDirective, RouterLink, MatButtonModule],
  templateUrl: './resolve-challenge.component.html',
  styleUrl: './resolve-challenge.component.scss',
})
export class ResolveChallengeComponent {
  private readonly document = inject(DOCUMENT);
  private readonly challengeService = inject(AdminChallengeService);
  private readonly dialogService = inject(DialogService);
  private readonly challengeInstance$ = inject(ActivatedRoute).paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      return this.challengeService.getChallengeInstance(id);
    }),
    shareReplay(),
  );
  public readonly challengeInstance = toSignal(this.challengeInstance$);
  public readonly unresolved = toSignal(
    this.challengeInstance$.pipe(
      filter((result) => result.success === true),
      map((result) => result.result.participants.some((p) => p.status === 'OPEN')),
    ),
  );
  public readonly resolveError = signal<string>('');

  public async setWinner(player: ProtectedPlayer, challengeInstanceId: number): Promise<void> {
    const confirm = await this.dialogService.showConfirmDialog(
      `Are you sure ${player.name} is the winner?`,
    );
    if (!confirm) return;
    this.challengeService
      .resolveChallengeInstance(challengeInstanceId, {
        winningPlayer: player.id,
        status: 'COMPLETED',
      })
      .subscribe((res) =>
        res.success ? this.document.location.reload() : this.resolveError.set(res.error.message),
      );
  }

  public async markAsFailed(challengeInstanceId: number): Promise<void> {
    const confirm = await this.dialogService.showConfirmDialog(
      `Are you sure you wish to mark this challenge as failed?`,
    );
    if (!confirm) return;
    this.challengeService
      .resolveChallengeInstance(challengeInstanceId, { status: 'FAILED' })
      .subscribe((res) =>
        res.success ? this.document.location.reload() : this.resolveError.set(res.error.message),
      );
  }
}
