import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAttemptComponent } from './demo-attempt.component';

describe('DemoAttemptComponent', () => {
  let component: DemoAttemptComponent;
  let fixture: ComponentFixture<DemoAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
