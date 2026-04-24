import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ChallengeService } from '../../core/services/player/challenge.service';
import { PlayerService } from '../../core/services/player/player.service';
import { TitleService } from '../../core/services/player/title.service';
import { ChallengeCardComponent } from '../../shared/components/challenge-card/challenge-card.component';
import { TitleComponent } from '../../shared/components/title/title.component';
import { LoadSignalDirective } from '../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-landing',
  imports: [LoadSignalDirective, TitleComponent, ChallengeCardComponent, MatIcon, MatTooltipModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private readonly challengeService = inject(ChallengeService);
  public readonly currentChallenge = toSignal(this.challengeService.getCurrentChallenge());
  public readonly challenges = toSignal(this.challengeService.getChallenges());
  public readonly player = toSignal(inject(PlayerService).getDetails());
  public readonly user = toSignal(
    inject(AuthService).user$.pipe(
      map((user) => {
        if (user.role !== 'player') throw new Error('Player user expected');
        return user;
      }),
    ),
    { requireSync: true },
  );
  public readonly titles = toSignal(inject(TitleService).getTitles());
  // TODO move these to db
  /**
   * Move these to db
   */
  public readonly attributeIcons: Record<number, string> = {
    1: 'star_border',
    2: 'anchor',
    3: 'psychology',
  };
}
