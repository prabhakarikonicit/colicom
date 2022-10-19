import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyAttemptComponent } from './study-attempt.component';

describe('StudyAttemptComponent', () => {
  let component: StudyAttemptComponent;
  let fixture: ComponentFixture<StudyAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyAttemptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
