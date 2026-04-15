import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attribute } from '../../shared/models/attribute.model';
import { Player } from '../../shared/models/player.model';
import { ApiResult, ApiService } from './api.service';

export interface Leaderboard {
  players: Player[];
  attribute: Attribute;
  currentPlayerPosition: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private readonly apiService = inject(ApiService);

    public getLeaderboards(): Observable<ApiResult<Leaderboard[]>> {
      return this.apiService.get<Leaderboard[]>(`/public/leaderboards`);
    }
}
