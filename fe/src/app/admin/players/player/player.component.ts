import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LoadSignalDirective } from '../../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-player',
  imports: [LoadSignalDirective, RouterLink, TitleComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  private readonly adminPlayerService = inject(AdminPlayerService);
  private readonly id$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => Number(params.get('id'))),
  );

  public readonly player = toSignal(
    this.id$.pipe(switchMap((id) => this.adminPlayerService.getPlayer(id))),
  );

  public readonly titles = toSignal(
    this.id$.pipe(switchMap((id) => this.adminPlayerService.getTitlesForPlayer(id))),
  );

  public readonly currentChallenge = toSignal(
    this.id$.pipe(switchMap((id) => this.adminPlayerService.getCurrentChallengeForPlayer(id))),
  );
}
