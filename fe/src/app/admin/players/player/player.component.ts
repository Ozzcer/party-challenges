import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AdminPlayerService } from '../../../core/services/admin/admin-player.service';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  private readonly adminPlayerService = inject(AdminPlayerService);
  private readonly id$ = inject(ActivatedRoute).paramMap.pipe(
    map((paramMap) => paramMap.get('id')),
  );

  public readonly player = toSignal(
    this.id$.pipe(switchMap((id) => this.adminPlayerService.getPlayer(parseInt(id!)))),
  );
}
