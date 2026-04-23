import { inject, Injectable } from '@angular/core';
import { ProtectedChallengeInstanceDetails } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private readonly apiService = inject(ApiService);

  public getChallenges(): Observable<ApiResult<ProtectedChallengeInstanceDetails[]>> {
    return this.apiService.get<ProtectedChallengeInstanceDetails[]>('/player/challenges');
  }

  public getCurrentChallenge(): Observable<ApiResult<ProtectedChallengeInstanceDetails>> {
    return this.apiService.get<ProtectedChallengeInstanceDetails>('/player/current-challenge');
  }
}
