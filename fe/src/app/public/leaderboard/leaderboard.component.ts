import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { LeaderboardService } from '../../core/services/public/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  imports: [LoadingComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private readonly leaderboardService = inject(LeaderboardService);

  readonly leaderboards = toSignal(this.leaderboardService.getLeaderboards());
}