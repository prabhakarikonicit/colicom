import { TestBed } from '@angular/core/testing';

import { StudyService } from './study.service';

describe('StudyServiceService', () => {
  let service: StudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
