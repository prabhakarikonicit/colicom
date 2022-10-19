import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatedexamResultsComponent } from './simulatedexam-results.component';

describe('SimulatedexamResultsComponent', () => {
  let component: SimulatedexamResultsComponent;
  let fixture: ComponentFixture<SimulatedexamResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatedexamResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatedexamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
