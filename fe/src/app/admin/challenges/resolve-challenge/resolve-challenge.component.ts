import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProtectedChallengeInstanceDetails, ProtectedPlayer } from '@party/shared';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-resolve-challenge',
  imports: [
    LoadSignalDirective,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './resolve-challenge.component.html',
  styleUrl: './resolve-challenge.component.scss',
})
export class ResolveChallengeComponent {
  private readonly document = inject(DOCUMENT);
  private readonly challengeService = inject(AdminChallengeService);
  private readonly dialogService = inject(DialogService);
  private readonly loadingService = inject(LoadingService);
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
  private readonly winnersForm$ = this.challengeInstance$.pipe(
    filter((instance) => instance.success),
    map((instance) => {
      if (instance.result.challenge.type === 'SOLO') return new FormGroup({});

      const formGroupData: { [key: number]: FormControl<boolean> } = {};
      instance.result.participants.forEach(
        (participant) =>
          (formGroupData[participant.id] = new FormControl<boolean>(false, {
            nonNullable: true,
          })),
      );
      return new FormGroup(formGroupData);
    }),
  );

  public readonly winnersForm = toSignal(
    this.challengeInstance$.pipe(
      filter((instance) => instance.success),
      map((instance) => {
        if (instance.result.challenge.type === 'SOLO') return new FormGroup({});

        const formGroupData: { [key: number]: FormControl<boolean> } = {};
        instance.result.participants.forEach(
          (participant) =>
            (formGroupData[participant.playerId] = new FormControl<boolean>(false, {
              nonNullable: true,
            })),
        );
        return new FormGroup(formGroupData);
      }),
    ),
  );
  public async setWinner(player: ProtectedPlayer, challengeInstanceId: number): Promise<void> {
    const confirm = await this.dialogService.showConfirmDialog(
      `Are you sure ${player.name} is the winner?`,
    );
    if (!confirm) return;
    this.loadingService.showLoader();
    this.challengeService
      .resolveChallengeInstance(challengeInstanceId, {
        winningPlayers: [player.id],
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
    this.loadingService.showLoader();
    this.challengeService
      .resolveChallengeInstance(challengeInstanceId, { status: 'FAILED' })
      .subscribe((res) =>
        res.success ? this.document.location.reload() : this.resolveError.set(res.error.message),
      );
  }

  public async setAdversarialWinners(
    challengeInstance: ProtectedChallengeInstanceDetails,
    formGroup: FormGroup<{ [x: number]: FormControl<boolean> }>,
  ): Promise<void> {
    const winners = Object.entries(formGroup.getRawValue())
      .filter((entry) => entry[1])
      .map((entry) => parseInt(entry[0]));

    // TODO shit
    if (winners.length === 0) {
      alert('Must pick at least one winner');
      return;
    }

    const playerNames = winners.map(
      (winner) =>
        challengeInstance.participants.find((part) => part.player.id === winner)?.player.name ||
        'Unknown',
    );

    const confirm = await this.dialogService.showConfirmDialog(
      `Are you sure these players won: ${playerNames.toString()}`,
    );
    console.log(challengeInstance);
    console.log(formGroup.getRawValue());
    if (!confirm) return;
    this.loadingService.showLoader();

    this.challengeService
      .resolveChallengeInstance(challengeInstance.id, {
        status: 'COMPLETED',
        winningPlayers: winners,
      })
      .subscribe((res) =>
        res.success ? this.document.location.reload() : this.resolveError.set(res.error.message),
      );
  }
}
