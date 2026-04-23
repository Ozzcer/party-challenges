import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadSignalDirective } from './load-signal.directive';

@Component({
  template: `<ng-container *appLoadSignal="value; let result">{{ result }}</ng-container>`,
  imports: [LoadSignalDirective],
})
class TestComponent {
  value: string | undefined = undefined;
}

describe('LoadSignalDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
