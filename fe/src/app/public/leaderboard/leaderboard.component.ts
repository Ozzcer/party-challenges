import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, filter, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LeaderboardService } from '../../core/services/public/leaderboard.service';
import { PublicTitleService } from '../../core/services/public/public-title.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { LeaderboardTableComponent } from './components/leaderboard-table/leaderboard-table.component';

@Component({
  selector: 'app-leaderboard',
  imports: [LeaderboardTableComponent, LoadingComponent, RouterLink],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly titles$ = inject(PublicTitleService).getAllTitles();

  public readonly user = toSignal(inject(AuthService).user$, { requireSync: true });

  public readonly leaderboards = toSignal(
    this.titles$.pipe(
      filter((result) => result.success),
      switchMap((result) =>
        combineLatest(
          result.result.map((title) =>
            this.leaderboardService.getLeaderboardByTitleId(title.id).pipe(startWith(undefined)),
          ),
        ),
      ),
    ),
  );
}
