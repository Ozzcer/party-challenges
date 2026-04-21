import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminPlayerService } from '../../../core/services/admin/player.service';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
})
export class PlayerListComponent {
  private readonly playerService = inject(AdminPlayerService);

  public readonly players = toSignal(this.playerService.getPlayersForCurrentEvent());
}
