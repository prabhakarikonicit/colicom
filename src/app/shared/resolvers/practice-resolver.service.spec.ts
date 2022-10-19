import { TestBed } from '@angular/core/testing';

import { PracticeResolverService } from './practice-resolver.service';

describe('PracticeResolverService', () => {
  let service: PracticeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
