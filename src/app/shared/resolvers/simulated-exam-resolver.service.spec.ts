import { TestBed } from '@angular/core/testing';

import { SimulatedExamResolverService } from './simulated-exam-resolver.service';

describe('SimulatedExamResolverService', () => {
  let service: SimulatedExamResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatedExamResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
