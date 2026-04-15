import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLoginComponent } from './player-login.component';

describe('PlayerLoginComponent', () => {
  let component: PlayerLoginComponent;
  let fixture: ComponentFixture<PlayerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
