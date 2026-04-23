import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminEventService } from '../../core/services/admin/admin-event.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.component.scss',
})
export class AdminLandingComponent {
  public readonly currentEvent = toSignal(inject(AdminEventService).getCurrentEvent());
}
