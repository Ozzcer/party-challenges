import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from '../../../shared/models/player.model';
import { ApiResult, ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPlayerService {
  private readonly apiService = inject(ApiService);

  public getPlayersForCurrentEvent(): Observable<ApiResult<Player[]>> {
    return of({
      success: true,
      error: null,
      result: [
        {
          id: 1,
          playerCode: 'ABC123',
          name: 'Alice',
          completedChallenges: 3,
          attributeScores: {
            attribute: { id: 1, name: 'Strength', description: 'Physical power' },
            score: 42,
          },
          activeChallengeInstanceId: undefined,
        },
        {
          id: 2,
          playerCode: 'XYZ789',
          name: 'Bob',
          completedChallenges: 1,
          attributeScores: {
            attribute: { id: 2, name: 'Wit', description: 'Mental sharpness' },
            score: 17,
          },
          activeChallengeInstanceId: 5,
        },
      ],
    });
  }
}
