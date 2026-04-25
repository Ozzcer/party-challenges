
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { LoadingService } from '../../../core/services/loading.service';
@Component({
  selector: 'app-full-screen-loader',
  imports: [MatProgressSpinnerModule],
  templateUrl: './full-screen-loader.component.html',
  styleUrl: './full-screen-loader.component.scss',
})
export class FullScreenLoaderComponent {
  private readonly router = inject(Router);
  public loader = toSignal(inject(LoadingService).loader$)
  public navigating = computed(() => !!this.router.currentNavigation());
}