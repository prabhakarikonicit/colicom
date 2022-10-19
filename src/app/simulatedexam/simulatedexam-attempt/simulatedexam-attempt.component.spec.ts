import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatedexamAttemptComponent } from './simulatedexam-attempt.component';

describe('SimulatedexamAttemptComponent', () => {
  let component: SimulatedexamAttemptComponent;
  let fixture: ComponentFixture<SimulatedexamAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatedexamAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatedexamAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
