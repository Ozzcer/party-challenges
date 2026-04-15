import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerChallengeService {
  private readonly apiService = inject(ApiService);

  public getChallenges() {
  }
}
