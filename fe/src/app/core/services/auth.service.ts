import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { ApiResult, ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: ApiService,
  ) {}

  public adminLogin(username: string, password: string): Observable<ApiResult<null>> {
    return this.apiService
      .post<null>('/admin/login', {
        username,
        password,
      });
  }

  public getUser(): Observable<ApiResult<User>> {
    return this.apiService.get<User>('/auth/me');
  }

  public logout(): Observable<ApiResult<null>> {
    return this.apiService.get<null>('/auth/logout');
  }
}

