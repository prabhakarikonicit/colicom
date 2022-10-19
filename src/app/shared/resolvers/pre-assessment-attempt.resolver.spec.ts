import { TestBed } from '@angular/core/testing';

import { PreAssessmentAttemptResolver } from './pre-assessment-attempt.resolver';

describe('PreAssessmentAttemptResolver', () => {
  let resolver: PreAssessmentAttemptResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PreAssessmentAttemptResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
