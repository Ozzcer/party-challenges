import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiErrorComponent } from './api-error.component';

describe('ApiErrorComponent', () => {
  let component: ApiErrorComponent;
  let fixture: ComponentFixture<ApiErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
