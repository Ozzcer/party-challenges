import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { ChallengeService } from '../../core/services/player/challenge.service';
import { PlayerService } from '../../core/services/player/player.service';
import { TitleService } from '../../core/services/player/title.service';
import { LoadSignalDirective } from '../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-landing',
  imports: [LoadSignalDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private readonly challengeService = inject(ChallengeService);
  public readonly currentChallenge = toSignal(this.challengeService.getCurrentChallenge());
  public readonly challenges = toSignal(this.challengeService.getChallenges());
  public readonly user = toSignal(inject(AuthService).user$);
  public readonly playerDetails = toSignal(inject(PlayerService).getDetails());
  public readonly titles = toSignal(inject(TitleService).getTitles());
}
