import { TestBed } from '@angular/core/testing';

import { DemoResolver } from './demo.resolver';

describe('DemoResolver', () => {
  let resolver: DemoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DemoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
