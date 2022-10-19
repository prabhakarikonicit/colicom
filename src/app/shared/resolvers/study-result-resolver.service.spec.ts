import { TestBed } from '@angular/core/testing';

import { StudyResultResolverService } from './study-result-resolver.service';

describe('StudyResultResolverService', () => {
  let service: StudyResultResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyResultResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
