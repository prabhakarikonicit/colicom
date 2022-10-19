import { TestBed } from '@angular/core/testing';

import { ProgressQuestionManagerService } from './progress-question-manager.service';

describe('ProgressQuestionManagerService', () => {
  let service: ProgressQuestionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressQuestionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
