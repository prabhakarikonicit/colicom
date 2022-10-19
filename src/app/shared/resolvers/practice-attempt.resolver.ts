import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssessmentAttemptsResponse } from '../interfaces/interfaces';
import { EnrollmentService } from '../services/enrollment.service';
import { ModuleQuestionService } from '../services/module-question.service';
import { ModuleService } from '../services/module.service';
import { ModuleAttemptQuestionService } from '../services/module-attempt-question.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeAttemptResolver implements Resolve<boolean> {

  constructor(private enrollmentService : EnrollmentService, private moduleService : ModuleService, private moduleQuestionService : ModuleQuestionService, private moduleAttemptQuestionService : ModuleAttemptQuestionService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const examModule = this.enrollmentService.getSelectedExamModule();

    // do we have the exam? else error out
    if (examModule === undefined) {
      return of(false);
    }

    return forkJoin([
      this.moduleQuestionService.queryForModuleWithAnswers(examModule.moduleId, 'practice'),
      this.moduleAttemptQuestionService.queryForModuleAttempt(this.moduleService.getAttempt().id),
      this.moduleService.loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers(this.moduleService.getAttempt().id)
    ]).pipe(map((result: any[]) => {
      return {
        glossaryTerms : result[0],
        moduleAttemptQuestionResponse : result[1],
        response1 : result[2]
      }
    }));
    return of(true);
  }
}
