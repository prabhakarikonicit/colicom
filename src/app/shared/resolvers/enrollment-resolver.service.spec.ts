import { TestBed } from '@angular/core/testing';

import { EnrollmentResolverService } from './enrollment-resolver.service';

describe('EnrollmentResolverService', () => {
  let service: EnrollmentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
