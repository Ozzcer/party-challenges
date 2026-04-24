import { Component, input } from '@angular/core';
import { Leaderboard, User } from '@party/shared';

@Component({
  selector: 'app-leaderboard-table',
  imports: [],
  templateUrl: './leaderboard-table.component.html',
  styleUrl: './leaderboard-table.component.scss',
})
export class LeaderboardTableComponent {
  public readonly leaderboard = input.required<Leaderboard>();
  public readonly user = input.required<User>();
}
