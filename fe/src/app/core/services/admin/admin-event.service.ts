import { inject, Injectable } from '@angular/core';
import type { GameEvent } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private readonly apiService = inject(ApiService);

  public getCurrentEvent(): Observable<ApiResult<GameEvent>> {
    return this.apiService.get<GameEvent>('/admin/current-event');
  }
}
