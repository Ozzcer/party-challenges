import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignChallengeComponent } from './assign-challenge.component';

describe('AssignChallengeComponent', () => {
  let component: AssignChallengeComponent;
  let fixture: ComponentFixture<AssignChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignChallengeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignChallengeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
