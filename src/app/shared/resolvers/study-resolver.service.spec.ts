import { TestBed } from '@angular/core/testing';

import { StudyResolverService } from './study-resolver.service';

describe('StudyResolverService', () => {
  let service: StudyResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
