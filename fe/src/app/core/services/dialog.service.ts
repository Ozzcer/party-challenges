import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  public async showConfirmDialog(message: string): Promise<boolean> {
    return confirm(message);
  }
}
