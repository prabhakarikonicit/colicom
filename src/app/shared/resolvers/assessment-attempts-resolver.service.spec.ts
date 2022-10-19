import { TestBed } from '@angular/core/testing';

import { AssessmentAttemptsResolverService } from './assessment-attempts-resolver.service';

describe('AssessmentAttemptsResolverService', () => {
  let service: AssessmentAttemptsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentAttemptsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
