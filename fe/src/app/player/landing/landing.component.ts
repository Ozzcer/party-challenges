import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { PlayerChallengeService } from '../../core/services/player/challenge.service';
import { TitleService } from '../../core/services/player/entity.service';
import { PlayerService } from '../../core/services/player/player.service';

@Component({
  selector: 'app-landing',
  imports: [JsonPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  public readonly challenges = toSignal(inject(PlayerChallengeService).getChallenges());
  public readonly user = toSignal(inject(AuthService).user$);
  public readonly playerDetails = toSignal(inject(PlayerService).getDetails());
  public readonly titles = toSignal(inject(TitleService).getTitles());
}
