import { inject, Injectable } from '@angular/core';
import { ProtectedTitle } from '@party/shared';
import { map, Observable } from 'rxjs';
import { mapEmptyTitles } from '../../lib/map-empty-titles.lib';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly apiService = inject(ApiService);

  public getTitles(): Observable<ApiResult<ProtectedTitle[]>> {
    return this.apiService.get<ProtectedTitle[]>('/player/titles').pipe(map(mapEmptyTitles));
  }
}
