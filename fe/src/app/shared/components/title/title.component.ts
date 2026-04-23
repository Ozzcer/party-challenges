import { Component, input } from '@angular/core';
import { Title } from '@party/shared';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  public readonly title = input.required<Title>();
}
