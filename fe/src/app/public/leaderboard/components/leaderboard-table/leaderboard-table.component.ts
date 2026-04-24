import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Leaderboard, ProtectedPlayerAttributeScore, User, WithRequired } from '@party/shared';

@Component({
  selector: 'app-leaderboard-table',
  imports: [NgClass, MatIconModule, MatTooltipModule],
  templateUrl: './leaderboard-table.component.html',
  styleUrl: './leaderboard-table.component.scss',
})
export class LeaderboardTableComponent {
  public readonly leaderboard = input.required<Leaderboard>();
  public readonly user = input.required<User>();
  public readonly leaderboardRows = computed(() => {
    const leaderboard = this.leaderboard();
    const currentPlayer = leaderboard.currentPlayer;
    const attributeIds = leaderboard.title.requirements.map((req) => req.attributeId);
    let currentPlayerFound = false;
    const rows = leaderboard.players.map<LeaderboardRow>((player, index) => {
      let match = false;
      if (currentPlayer?.id === player.id) {
        match = true;
        currentPlayerFound = true;
      }
      return {
        attributeScores: player.playerAttributeScores.filter((score) =>
          attributeIds.includes(score.attributeId),
        ),
        name: player.name!,
        currentPlayer: match,
        position: index + 1,
      };
    });

    if (currentPlayer && !currentPlayerFound) {
      rows.push({
        attributeScores: currentPlayer.playerAttributeScores.filter((score) =>
          attributeIds.includes(score.attributeId),
        ),
        currentPlayer: true,
        name: currentPlayer.name!,
        position: leaderboard.currentPlayerPosition!,
      });
    }

    return rows;
  });

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

interface LeaderboardRow {
  position: number;
  name: string;
  currentPlayer: boolean;
  attributeScores: WithRequired<ProtectedPlayerAttributeScore, 'attribute'>[];
}
