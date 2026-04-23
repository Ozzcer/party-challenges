import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-player-list',
  imports: [LoadSignalDirective, RouterLink, ReactiveFormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  private readonly playerService = inject(AdminPlayerService);
  private readonly players$ = this.playerService.getPlayersForCurrentEvent();
  private readonly nameFilterSubject = new BehaviorSubject<string>('');

  private readonly filteredPlayers$ = combineLatest({
    players: this.players$,
    filter: this.nameFilterSubject.asObservable(),
  }).pipe(
    map(({ players, filter }) => {
      if (!players.success || !filter) return players;
      return {
        ...players,
        result: players.result.filter((player) => player.name?.includes(filter)),
      };
    }),
  );

  public readonly players = toSignal(this.filteredPlayers$);
  public readonly unusedPlayerCodes = toSignal(this.playerService.getUnusedPlayerCodes());
  public readonly filterForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
  });

  public setFilter(): void {
    this.nameFilterSubject.next(this.filterForm.getRawValue().name);
    console.log(this.nameFilterSubject.value);
  }

  public resetFilter(): void {
    this.nameFilterSubject.next('');
    this.filterForm.reset();
  }
}
