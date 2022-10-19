import { TestBed } from '@angular/core/testing';

import { ModuleAttemptQuestionService } from './module-attempt-question.service';

describe('ModuleAttemptQuestionService', () => {
  let service: ModuleAttemptQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleAttemptQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
