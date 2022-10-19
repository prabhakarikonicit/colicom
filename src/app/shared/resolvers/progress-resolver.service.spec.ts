import { TestBed } from '@angular/core/testing';

import { ProgressResolverService } from './progress-resolver.service';

describe('ProgressResolverService', () => {
  let service: ProgressResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
