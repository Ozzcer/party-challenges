import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  styles: `
    .loading-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  template: `
    <div class="loading-container">
      <span>Loading...</span>
    </div>
  `,
})
export class LoadingComponent {}
