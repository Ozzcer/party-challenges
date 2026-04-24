import { inject, Injectable } from '@angular/core';
import {
  Attribute,
  Challenge,
  ChallengeDetails,
  ChallengeInstance,
  ChallengeInstanceCreated,
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

  public getAttributes(): Observable<ApiResult<Attribute[]>> {
    return this.apiService.get<Attribute[]>('/admin/attributes');
  }

  public getChallenges(): Observable<ApiResult<Challenge[]>> {
    return this.apiService.get<Challenge[]>('/admin/challenges');
  }

  public getUncompletedChallengesByPlayers(
    playerIds: number[],
  ): Observable<ApiResult<ChallengeDetails[]>> {
    return this.apiService.post<ChallengeDetails[]>('/admin/challenges/uncompleted', { playerIds });
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

  public assignChallenge(
    challengeId: number,
    playerIds: number[],
  ): Observable<ApiResult<ChallengeInstanceCreated[]>> {
    return this.apiService.post(`/admin/challenges/${challengeId}/assign`, { playerIds });
  }
}
