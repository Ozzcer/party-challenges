import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ChallengeService } from '../../core/services/player/challenge.service';
import { TitleService } from '../../core/services/player/title.service';
import { TitleComponent } from '../../shared/components/title/title.component';
import { LoadSignalDirective } from '../../shared/directives/load-signal.directive';

@Component({
  selector: 'app-landing',
  imports: [LoadSignalDirective, TitleComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private readonly challengeService = inject(ChallengeService);
  public readonly currentChallenge = toSignal(this.challengeService.getCurrentChallenge());
  public readonly challenges = toSignal(this.challengeService.getChallenges());
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
}
