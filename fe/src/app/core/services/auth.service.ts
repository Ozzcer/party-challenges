import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import type { User } from '@party/shared';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResult, ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly userSubject$ = new BehaviorSubject<User | null>(null);
  /**
   * Cached user state, will error if called with no user in cache. Only call behind guards.
   */
  public readonly user$ = this.userSubject$.pipe(
    map((user) => {
      if (!user) {
        this.router.navigateByUrl('/');
        throw new Error('User pipe used before login');
      }
      return user;
    }),
  );

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
