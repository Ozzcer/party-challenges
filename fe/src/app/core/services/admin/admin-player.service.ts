import { inject, Injectable } from '@angular/core';
import type { ChallengeInstanceDetails, Player, ProtectedTitle } from '@party/shared';
import { map, Observable } from 'rxjs';
import { mapEmptyTitles } from '../../lib/map-empty-titles.lib';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPlayerService {
  private readonly apiService = inject(ApiService);

  public getUnusedPlayerCodes(): Observable<ApiResult<string[]>> {
    return this.apiService.get<string[]>('/admin/unused-player-codes');
  }

  public getPlayersForCurrentEvent(): Observable<ApiResult<Player[]>> {
    return this.apiService.get<Player[]>('/admin/players');
  }

  public getPlayer(id: number): Observable<ApiResult<Player>> {
    return this.apiService.get<Player>('/admin/player/' + id);
  }

  public getPlayerIdByCode(code: string): Observable<ApiResult<number>> {
    return this.apiService.get<number>('/admin/player-by-code/' + code);
  }

  public getCurrentChallengeForPlayer(id: number): Observable<ApiResult<ChallengeInstanceDetails>> {
    return this.apiService.get(`/admin/players/${id}/challenge`);
  }

  public getTitlesForPlayer(id: number): Observable<ApiResult<ProtectedTitle[]>> {
    return this.apiService
      .get<ProtectedTitle[]>(`/admin/players/${id}/titles`)
      .pipe(map(mapEmptyTitles));
  }
}
