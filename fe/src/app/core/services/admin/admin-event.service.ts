import { inject, Injectable } from '@angular/core';
import type { CurrentGameEvent } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private readonly apiService = inject(ApiService);

  public getCurrentEvent(): Observable<ApiResult<CurrentGameEvent>> {
    return this.apiService.get<CurrentGameEvent>('/admin/current-event');
  }
}
