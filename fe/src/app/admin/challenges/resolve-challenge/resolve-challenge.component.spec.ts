import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveChallengeComponent } from './resolve-challenge.component';

describe('ResolveChallengeComponent', () => {
  let component: ResolveChallengeComponent;
  let fixture: ComponentFixture<ResolveChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveChallengeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolveChallengeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
