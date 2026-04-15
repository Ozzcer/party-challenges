import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNameComponent } from './set-name.component';

describe('SetNameComponent', () => {
  let component: SetNameComponent;
  let fixture: ComponentFixture<SetNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SetNameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
