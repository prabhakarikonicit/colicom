import { TestBed } from '@angular/core/testing';

import { ModuleQuestionService } from './module-question.service';

describe('ModuleQuestionService', () => {
  let service: ModuleQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
