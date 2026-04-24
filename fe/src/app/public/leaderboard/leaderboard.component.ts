import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { LeaderboardService } from '../../core/services/public/leaderboard.service';
import { LoadSignalDirective } from '../../shared/directives/load-signal.directive';
import { LeaderboardTableComponent } from './components/leaderboard-table/leaderboard-table.component';

@Component({
  selector: 'app-leaderboard',
  imports: [LeaderboardTableComponent, LoadSignalDirective],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private readonly leaderboardService = inject(LeaderboardService);

  public user = toSignal(inject(AuthService).user$, { requireSync: true });
  public readonly leaderboards = toSignal(this.leaderboardService.getLeaderboards());
}