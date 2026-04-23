import { Component, input } from '@angular/core';

@Component({
  selector: 'app-api-error',
  imports: [],
  templateUrl: './api-error.component.html',
  styleUrl: './api-error.component.scss',
})
export class ApiErrorComponent {
  readonly message = input.required<string>();
}
