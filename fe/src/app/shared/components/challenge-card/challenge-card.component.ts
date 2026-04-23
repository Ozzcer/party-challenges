import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ProtectedChallengeInstanceDetails } from '@party/shared';

@Component({
  selector: 'app-challenge-card',
  imports: [TitleCasePipe],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
})
export class ChallengeCardComponent {
  public readonly userId = input<number>();
  public readonly challenge = input.required<ProtectedChallengeInstanceDetails>();
}
