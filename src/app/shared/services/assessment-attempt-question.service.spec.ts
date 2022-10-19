import { TestBed } from '@angular/core/testing';

import { AssessmentAttemptQuestionService } from './assessment-attempt-question.service';

describe('AssessmentAttemptQuestionService', () => {
  let service: AssessmentAttemptQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentAttemptQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
