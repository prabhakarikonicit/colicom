import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadinessComponent } from './readiness.component';

describe('ReadinessComponent', () => {
  let component: ReadinessComponent;
  let fixture: ComponentFixture<ReadinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
