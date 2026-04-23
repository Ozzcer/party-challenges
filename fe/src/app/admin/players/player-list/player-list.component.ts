import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-player-list',
  imports: [LoadSignalDirective, RouterLink],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  private readonly playerService = inject(AdminPlayerService);

  public readonly players = toSignal(this.playerService.getPlayersForCurrentEvent());
  public readonly unusedPlayerCodes = toSignal(this.playerService.getUnusedPlayerCodes());
}
