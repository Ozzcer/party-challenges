import { Component, inject } from '@angular/core';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
})
export class PlayerListComponent {
  private readonly playerService = inject(PlayerService);

  public readonly players$ = this.playerService.getPlayersForCurrentEvent();
}
