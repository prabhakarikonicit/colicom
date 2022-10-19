import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillintheblankComponent } from './fillintheblank.component';

describe('FillintheblankComponent', () => {
  let component: FillintheblankComponent;
  let fixture: ComponentFixture<FillintheblankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillintheblankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FillintheblankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
