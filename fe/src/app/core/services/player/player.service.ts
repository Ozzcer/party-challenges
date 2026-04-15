import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly apiService = inject(ApiService);

  public setName(name: string): Observable<ApiResult<null>> {
    return this.apiService.post<null>('/player/set-name', { name });
  }
}
