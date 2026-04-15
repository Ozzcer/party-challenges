import { inject, Injectable } from '@angular/core';
import type { Player } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPlayerService {
  private readonly apiService = inject(ApiService);

  public getPlayersForCurrentEvent(): Observable<ApiResult<Player[]>> {
    return this.apiService.get<Player[]>('/admin/players');
  }
}
