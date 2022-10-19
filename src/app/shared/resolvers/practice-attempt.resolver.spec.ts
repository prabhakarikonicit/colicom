import { TestBed } from '@angular/core/testing';

import { PracticeAttemptResolver } from './practice-attempt.resolver';

describe('PracticeAttemptResolver', () => {
  let resolver: PracticeAttemptResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PracticeAttemptResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
