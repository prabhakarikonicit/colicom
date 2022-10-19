import { TestBed } from '@angular/core/testing';

import { ModuleAttemptService } from './module-attempt.service';

describe('ModuleAttemptService', () => {
  let service: ModuleAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleAttemptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
