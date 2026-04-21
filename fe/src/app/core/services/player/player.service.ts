import { inject, Injectable } from '@angular/core';
import { ProtectedPlayer } from '@party/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly apiService = inject(ApiService);
  private readonly detailsSubject$ = new BehaviorSubject<ProtectedPlayer | null>(null);
  public readonly details$ = this.detailsSubject$.asObservable();

  public setName(name: string): Observable<ApiResult<null>> {
    return this.apiService.post<null>('/player/set-name', { name });
  }

  public isEnrolledInCurrentEvent(): Observable<ApiResult<boolean>> {
    return this.apiService.get<boolean>('/player/is-enrolled');
  }

  public clearCurrentDetails(): void {
    this.detailsSubject$.next(null);
  }
}
