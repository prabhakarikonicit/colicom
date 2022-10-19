import { TestBed } from '@angular/core/testing';

import { PreassessmentResultResolver } from './preassessment-result.resolver';

describe('PreassessmentResultResolver', () => {
  let resolver: PreassessmentResultResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PreassessmentResultResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
