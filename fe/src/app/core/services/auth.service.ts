import { inject, Injectable } from '@angular/core';
import type { User } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);

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
    return this.apiService.get<User>('/auth/me');
  }

  public logout(): Observable<ApiResult<null>> {
    return this.apiService.get<null>('/auth/logout');
  }
}
