import { TestBed } from '@angular/core/testing';

import { PracticeResultResolver } from './practice-result-resolver.resolver';

describe('PracticeResultResolverResolver', () => {
  let resolver: PracticeResultResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PracticeResultResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
