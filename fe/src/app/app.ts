import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullScreenLoaderComponent } from './shared/components/full-screen-loader/full-screen-loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FullScreenLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('fe');
}
