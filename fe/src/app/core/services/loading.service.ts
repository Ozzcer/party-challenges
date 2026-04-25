import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  public loader$ = this.loadingSubject.pipe(distinctUntilChanged(), shareReplay());

  public showLoader(): void {
    this.loadingSubject.next(true);
  }

  public hideLoader(): void {
    this.loadingSubject.next(false);
  }
}
