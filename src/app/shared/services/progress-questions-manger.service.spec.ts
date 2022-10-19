import { TestBed } from '@angular/core/testing';

import { ProgressQuestionsMangerService } from './progress-questions-manger.service';

describe('ProgressQuestionsMangerService', () => {
  let service: ProgressQuestionsMangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressQuestionsMangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
