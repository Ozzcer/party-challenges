import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { User } from '@party/shared';
import { combineLatest, filter, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { LeaderboardService } from '../../core/services/public/leaderboard.service';
import { PublicTitleService } from '../../core/services/public/public-title.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { LeaderboardTableComponent } from './components/leaderboard-table/leaderboard-table.component';

@Component({
  selector: 'app-leaderboard',
  imports: [LeaderboardTableComponent, LoadingComponent, RouterLink, MatButtonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly titles$ = inject(PublicTitleService).getAllTitles();
  private readonly loadingService = inject(LoadingService);

  public readonly user = toSignal(this.authService.user$, { requireSync: true });

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

  logout(user: User): void {
    const redirect = user.role === 'admin' ? '/admin/login' : '/login';
    this.loadingService.showLoader();
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl(redirect);
    });
  }
}
