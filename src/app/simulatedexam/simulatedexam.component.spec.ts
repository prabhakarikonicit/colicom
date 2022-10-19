import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatedexamComponent } from './simulatedexam.component';

describe('SimulatedexamComponent', () => {
  let component: SimulatedexamComponent;
  let fixture: ComponentFixture<SimulatedexamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatedexamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatedexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
