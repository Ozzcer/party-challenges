import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AdminChallengeService } from '../../../core/services/admin/admin-challenge.service';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-challenge-list',
  imports: [LoadSignalDirective],
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
})
export class ChallengeListComponent {
  private readonly adminChallengeService = inject(AdminChallengeService);

  public readonly challenges = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => {
        const playerId = params.get('playerId');
        return playerId ? [Number(playerId)] : [];
      }),
      switchMap((playerIds) =>
        this.adminChallengeService.getUncompletedChallengesByPlayers(playerIds),
      ),
    ),
  );
}
