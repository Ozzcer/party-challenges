import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChallengeStatus, ProtectedChallengeInstanceDetails } from '@party/shared';

@Component({
  selector: 'app-challenge-card',
  imports: [TitleCasePipe, MatIconModule, MatTooltipModule],
  templateUrl: './challenge-card.component.html',
  styleUrl: './challenge-card.component.scss',
})
export class ChallengeCardComponent {
  public readonly userId = input<number>();
  public readonly challenge = input.required<ProtectedChallengeInstanceDetails>();
  // TODO move these to db
  /**
   * Move these to db
   */
  public readonly attributeIcons: Record<number, string> = {
    1: 'star_border',
    2: 'anchor',
    3: 'psychology',
  };
  public readonly statusClasses: Record<ChallengeStatus, string> = {
    COMPLETED: 'bg-success',
    FAILED: 'bg-error',
    OPEN: '',
  };
}
