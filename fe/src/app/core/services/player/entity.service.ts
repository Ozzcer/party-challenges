import { inject, Injectable } from '@angular/core';
import { ProtectedTitle } from '@party/shared';
import { Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly apiService = inject(ApiService);

  public getTitles(): Observable<ApiResult<ProtectedTitle[]>> {
    return this.apiService.get<ProtectedTitle[]>('/player/titles');
  }
}
