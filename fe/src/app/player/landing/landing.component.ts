import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { PlayerChallengeService } from '../../core/services/player/challenge.service';

@Component({
  selector: 'app-landing',
  imports: [JsonPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  public readonly challenges = toSignal(inject(PlayerChallengeService).getChallenges());
  public readonly user = toSignal(inject(AuthService).user$);
}
