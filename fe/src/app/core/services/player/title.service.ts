import { inject, Injectable } from '@angular/core';
import { ProtectedTitle } from '@party/shared';
import { map, Observable } from 'rxjs';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly apiService = inject(ApiService);

  public getTitles(): Observable<ApiResult<ProtectedTitle[]>> {
    return this.apiService.get<ProtectedTitle[]>('/player/titles').pipe(
      // TODO this should be in the API as a default, but stubbing for now
      map((titles) => {
        if (titles.success && titles.result.length === 0) {
          titles.result = [
            {
              createdAt: new Date(),
              description: 'The fooly foolerson',
              id: 0,
              imageUrl: '/images/fool.png',
              name: 'The Fool',
              titleType: 'SINGLE_REQUIREMENT',
              updatedAt: new Date(),
            },
          ];
        }
        return titles;
      }),
    );
  }
}
