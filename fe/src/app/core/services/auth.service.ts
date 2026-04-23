import { inject, Injectable } from '@angular/core';
import type { User } from '@party/shared';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
import { ApiResult, ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly userSubject$ = new BehaviorSubject<User | null>(null);
  /**
   * Only emits when a user is present — use behind guards that guarantee login.
   */
  public readonly user$ = this.userSubject$.pipe(filter((user): user is User => user !== null));

  public adminLogin(username: string, password: string): Observable<ApiResult<null>> {
    return this.apiService.post<null>('/admin/login', {
      username,
      password,
    });
  }

  public publicLogin(playerCode: string): Observable<ApiResult<null>> {
    return this.apiService.post<null>('/player/login', {
      playerCode,
    });
  }

  public getUser(): Observable<ApiResult<User>> {
    return this.apiService
      .get<User>('/auth/me')
      .pipe(tap((result) => this.userSubject$.next(result.success ? result.result : null)));
  }

  public logout(): Observable<ApiResult<null>> {
    return this.apiService.get<null>('/auth/logout').pipe(
      tap((result) => {
        if (result.success) this.userSubject$.next(null);
      }),
    );
  }
}
