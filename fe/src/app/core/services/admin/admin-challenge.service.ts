import { inject, Injectable } from '@angular/core';
import {
  Challenge,
  ChallengeInstance,
  CreateChallenge,
  ProtectedChallengeInstanceDetails,
  ResolveChallenge,
} from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminChallengeService {
  private readonly apiService = inject(ApiService);

  public getChallenges(): Observable<ApiResult<Challenge[]>> {
    return this.apiService.get<Challenge[]>('admin/challenges');
  }

  public createChallenge(createChallenge: CreateChallenge): Observable<ApiResult<Challenge>> {
    return this.apiService.post<Challenge>('/admin/challenges', createChallenge);
  }

  public getActiveChallengeInstances(): Observable<ApiResult<ProtectedChallengeInstanceDetails[]>> {
    return this.apiService.get('/admin/challenge-instances/active');
  }

  public getChallengeInstance(
    id: number,
  ): Observable<ApiResult<ProtectedChallengeInstanceDetails>> {
    return this.apiService.get('/admin/challenge-instances/' + id);
  }

  public resolveChallengeInstance(
    id: number,
    resolveChallenge: ResolveChallenge,
  ): Observable<ApiResult<ChallengeInstance>> {
    return this.apiService.post<ChallengeInstance>(
      `/admin/challenge-instances/${id}/resolve`,
      resolveChallenge,
    );
  }
}
