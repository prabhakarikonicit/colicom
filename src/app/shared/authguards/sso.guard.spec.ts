import { TestBed } from '@angular/core/testing';

import { SsoGuard } from './sso.guard';

describe('SsoGuard', () => {
  let guard: SsoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SsoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
