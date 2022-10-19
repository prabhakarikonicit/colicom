import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialModalDialogComponent } from './trial-modal-dialog.component';

describe('TrialModalDialogComponent', () => {
  let component: TrialModalDialogComponent;
  let fixture: ComponentFixture<TrialModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialModalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
