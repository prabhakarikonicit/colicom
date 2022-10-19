import { TestBed } from '@angular/core/testing';

import { ProgressQuestionService } from './progress-question.service';

describe('ProgressQuestionService', () => {
  let service: ProgressQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
