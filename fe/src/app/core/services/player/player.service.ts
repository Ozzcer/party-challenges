import { inject, Injectable } from '@angular/core';
import { ProtectedPlayerDetails } from '@party/shared';
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

  public isEnrolledInCurrentEvent(): Observable<ApiResult<boolean>> {
    return this.apiService.get<boolean>('/player/is-enrolled');
  }

  public getDetails(): Observable<ApiResult<ProtectedPlayerDetails>> {
    return this.apiService.get<ProtectedPlayerDetails>('/player/details');
  }
}
