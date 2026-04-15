import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveComponent } from './resolve.component';

describe('ResolveComponent', () => {
  let component: ResolveComponent;
  let fixture: ComponentFixture<ResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
