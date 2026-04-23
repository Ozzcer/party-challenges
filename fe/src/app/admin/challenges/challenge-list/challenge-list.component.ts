import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengeInstanceCreated } from '@party/shared';
import {
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  scan,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-challenge-list',
  imports: [LoadSignalDirective, ReactiveFormsModule, TitleCasePipe, RouterLink],
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
})
export class ChallengeListComponent {
  private readonly adminChallengeService = inject(AdminChallengeService);
  private readonly adminPlayerService = inject(AdminPlayerService);

  private readonly addQueryParamPlayer$: Observable<MutatePlayersAction> = inject(
    ActivatedRoute,
  ).queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get('playerCode')),
    filter((playerCode) => playerCode !== null),
    this.playerCodeToAddAction(),
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
    shareReplay(),
  );

  private readonly challenges$ = this.players$.pipe(
    map((entries) => entries.map((entry) => entry.id)),
    switchMap((playerIds) =>
      this.adminChallengeService.getUncompletedChallengesByPlayers(playerIds),
    ),
  );

  public readonly players = toSignal(this.players$, { initialValue: [] as PlayerEntry[] });
  public readonly challenges = toSignal(this.challenges$);

  public readonly addPlayerForm = new FormGroup({
    playerCode: new FormControl('', { nonNullable: true }),
  });
  public readonly addResult = signal<string>('');
  public readonly assignResult = signal<ChallengeInstanceCreated[] | null>(null);
  public readonly assignError = signal<string>('');

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
    this.addPlayerCodeSubject.next(playerCode);
    this.addPlayerForm.reset();
  }

  public removePlayer(playerId: number): void {
    this.addResult.set('');
    this.removePlayerIdSubject.next(playerId);
  }

  public assignChallenge(challengeId: number, players: PlayerEntry[]): void {
    this.adminChallengeService
      .assignChallenge(
        challengeId,
        players.map((player) => player.id),
      )
      .subscribe((res) =>
        res.success ? this.assignResult.set(res.result) : this.assignError.set(res.error.message),
      );
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
