import { inject, Injectable } from '@angular/core';
import { ProtectedChallengeInstance } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerChallengeService {
  private readonly apiService = inject(ApiService);

  public getChallenges(): Observable<ApiResult<ProtectedChallengeInstance[]>> {
    return this.apiService.get<ProtectedChallengeInstance[]>('player/challenges');
  }
}
