import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengeInstanceCreated } from '@party/shared';
import {
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-challenge-list',
  imports: [
    LoadSignalDirective,
    ReactiveFormsModule,
    TitleCasePipe,
    RouterLink,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
})
export class ChallengeListComponent {
  private readonly adminChallengeService = inject(AdminChallengeService);
  private readonly adminPlayerService = inject(AdminPlayerService);
  private readonly dialogService = inject(DialogService);

  private readonly addQueryParamPlayer$: Observable<MutatePlayersAction> = inject(
    ActivatedRoute,
  ).queryParamMap.pipe(
    map((queryParamMap) =>
      queryParamMap.getAll('playerCodes').flatMap((value) => value.split(',')),
    ),
    filter((playerCodes) => playerCodes.length > 0),
    switchMap((playerCodes) =>
      merge(...playerCodes.map((code) => of(code).pipe(this.playerCodeToAddAction()))),
    ),
  );

  private readonly removePlayerIdSubject = new Subject<number>();
  private readonly removePlayer$: Observable<MutatePlayersAction> = this.removePlayerIdSubject.pipe(
    map((id) => ({ type: 'remove', id })),
  );

  private readonly addPlayerCodeSubject = new Subject<string>();
  private readonly addPlayer$: Observable<MutatePlayersAction> = this.addPlayerCodeSubject.pipe(
    this.playerCodeToAddAction(),
  );

  private readonly players$: Observable<PlayerEntry[]> = merge(
    this.removePlayer$,
    this.addPlayer$,
    this.addQueryParamPlayer$,
  ).pipe(
    scan((players, action) => {
      if (action.type === 'add') {
        return players.some((player) => player.id === action.player.id)
          ? players
          : [...players, action.player];
      }
      return players.filter((player) => player.id !== action.id);
    }, [] as PlayerEntry[]),
    startWith([]), // TODO this double sends, make it not by creating a starting action from query param
    shareReplay(),
  );

  private readonly challenges$ = this.players$.pipe(
    map((entries) => entries.map((entry) => entry.id)),
    switchMap((playerIds) =>
      this.adminChallengeService.getUncompletedChallengesByPlayers(playerIds),
    ),
  );

  // TODO make dynamic
  public readonly filterForm = new FormGroup<{ [x: number]: FormControl<boolean> }>({
    1: new FormControl<boolean>(false, { nonNullable: true }),
    2: new FormControl<boolean>(false, { nonNullable: true }),
    3: new FormControl<boolean>(false, { nonNullable: true }),
  });
  public readonly addPlayerForm = new FormGroup({
    playerCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  public readonly addResult = signal<string>('');
  public readonly assignResult = signal<ChallengeInstanceCreated[] | null>(null);
  public readonly assignError = signal<{ error: string; id: number } | null>(null);
  public readonly challenges = toSignal(
    combineLatest({
      form: this.filterForm.valueChanges.pipe(
        startWith({
          1: false,
          2: false,
          3: false,
        } as Partial<{ [x: number]: boolean }>),
      ),
      challengesResult: this.challenges$,
    }).pipe(
      map(({ form, challengesResult }) => {
        const filterSet = Object.values(form).some((val) => val);
        if (challengesResult.success && filterSet) {
          const filteredChallenges = challengesResult.result.filter((challenge) => {
            return form[challenge.attributeId] === true;
          });

          challengesResult = {
            ...challengesResult,
            result: filteredChallenges,
          };
        }
        return challengesResult;
      }),
    ),
  );

  public readonly players = toSignal(this.players$, { initialValue: [] as PlayerEntry[] });
  public readonly playerCodes = computed(() => this.players().map((p) => p.playerCode));
  // public readonly challenges = toSignal(this.challenges$);

  private playerCodeToAddAction(): OperatorFunction<string, MutatePlayersAction> {
    return (source$) =>
      source$.pipe(
        switchMap((playerCode) =>
          this.adminPlayerService.getPlayerIdByCode(playerCode, true).pipe(
            map((id) => {
              if (!id.success) return null;
              return { id: id.result, playerCode };
            }),
          ),
        ),
        tap((player) =>
          player
            ? this.addResult.set(`Player ${player.playerCode} added`)
            : this.addResult.set('Player not found'),
        ),
        filter((player) => player !== null),
        map((player) => ({ type: 'add' as const, player })),
      );
  }

  public addPlayer(): void {
    const { playerCode } = this.addPlayerForm.getRawValue();
    if (!playerCode) return;
    this.resetOutputs();
    this.addPlayerCodeSubject.next(playerCode);
    this.addPlayerForm.reset();
  }

  public removePlayer(playerId: number): void {
    this.resetOutputs();
    this.removePlayerIdSubject.next(playerId);
  }

  public async assignChallenge(challengeId: number, players: PlayerEntry[]): Promise<void> {
    const confirm = await this.dialogService.showConfirmDialog(
      `Are you sure you wish to assign this challenge to: ${players.map((player) => player.playerCode).toString()}`,
    );
    if (!confirm) return;

    this.adminChallengeService
      .assignChallenge(
        challengeId,
        players.map((player) => player.id),
      )
      .subscribe((res) =>
        res.success
          ? this.assignResult.set(res.result)
          : this.assignError.set({ error: res.error.message, id: challengeId }),
      );
  }

  private resetOutputs(): void {
    this.addResult.set('');
    this.assignError.set(null);
    this.assignResult.set(null);
  }
}

interface PlayerEntry {
  id: number;
  playerCode: string;
}

type MutatePlayersAction =
  | {
      type: 'add';
      player: PlayerEntry;
    }
  | {
      type: 'remove';
      id: number;
    };
