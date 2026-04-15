import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Leaderboard } from '@party/shared';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private readonly apiService = inject(ApiService);

  public getLeaderboards(): Observable<ApiResult<Leaderboard[]>> {
    return this.apiService.get<Leaderboard[]>(`/public/leaderboards`);
  }
}
