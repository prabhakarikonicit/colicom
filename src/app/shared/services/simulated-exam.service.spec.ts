import { TestBed } from '@angular/core/testing';

import { SimulatedExamService } from './simulated-exam.service';

describe('SimulatedExamService', () => {
  let service: SimulatedExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatedExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
