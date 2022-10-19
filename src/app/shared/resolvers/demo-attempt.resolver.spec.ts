import { TestBed } from '@angular/core/testing';

import { DemoAttemptResolver } from './demo-attempt.resolver';

describe('DemoAttemptResolver', () => {
  let resolver: DemoAttemptResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DemoAttemptResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
