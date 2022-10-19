import { Injectable } from '@angular/core';
import { StudyItem } from '../interfaces/interfaces';
import { EnrollmentService } from './enrollment.service';
import { GlobalService } from './global.service';
import { ModuleAttemptService } from './module-attempt.service';
import { ProgressQuestionService } from './progress-question.service';
import { ModuleAttemptQuestionService } from './module-attempt-question.service';
import { ProgressService } from './progress.service';
import { ModuleService } from './module.service';

@Injectable({
  providedIn: 'root'
})
export class StudyService extends ModuleService {

  // defaults for study
  studyModes: StudyItem[] = [];
  studyOptions: StudyItem[] = [];
  studyQuantities: StudyItem[] = [];
  constructor(enrollmentService: EnrollmentService, progressQuestionService: ProgressQuestionService, globalService: GlobalService, moduleAttemptService: ModuleAttemptService, moduleAttemptQuestionService: ModuleAttemptQuestionService, progressService: ProgressService) {
    super(enrollmentService, progressQuestionService, globalService, moduleAttemptService, moduleAttemptQuestionService, progressService);
    this.restoreDropdownDefaults();
  }

  // defaults
  restoreDropdownDefaults() {
    this.studyModes = [
      { name: 'Flash Cards', value: 'flashcard', enabled: true },
      { name: 'Matching', value: 'matching', enabled: true },
      { name: 'Fill-In-The-Blank', value: 'fillintheblank', enabled: true }
    ];

    this.studyOptions = [
      { name: 'All', value: 'all', enabled: true },
      { name: 'Marked For Review', value: 'bookmarked', enabled: false },
      { name: 'Marked Incorrect', value: 'incorrect', enabled: false },
      { name: 'Not Seen', value: 'unseen', enabled: false }
    ];

    this.studyQuantities = [
      { name: 'All', value: 'all', enabled: true },
      { name: '10', value: 10, enabled: false },
      { name: '20', value: 20, enabled: false }
    ];
  };

  getStudyModes() {
    return this.studyModes;
  };

  getStudyOptions() {
    return this.studyOptions;
  };

  getStudyQuantities() {
    return this.studyQuantities;
  };

}
