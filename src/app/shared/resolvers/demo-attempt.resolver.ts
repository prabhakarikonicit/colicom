import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnrollmentService } from '../services/enrollment.service';
import { ModuleQuestionService } from '../services/module-question.service';
import { ModuleService } from '../services/module.service';
import { ModuleAttemptQuestionService } from '../services/module-attempt-question.service';
import { ExamModule } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DemoAttemptResolver implements Resolve<boolean> {

  constructor(private enrollmentService : EnrollmentService, private moduleService : ModuleService, private moduleQuestionService : ModuleQuestionService, private moduleAttemptQuestionService : ModuleAttemptQuestionService) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const examModule = this.enrollmentService.getSelectedExamModule();

    // do we have the exam? else error out
    if (examModule === undefined) {
      return of(false);
    }

    return forkJoin([
      this.moduleQuestionService.queryForModuleWithAnswers(examModule.moduleId, 'study'),
      this.moduleAttemptQuestionService.queryForModuleAttempt(this.moduleService.getAttempt().id),
      this.moduleService.loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers(this.moduleService.getAttempt().id)
    ]).pipe(map((result: any[]) => {
      let finalResponse = {
        glossaryTerms : result[0],
        moduleAttemptQuestionResponse : result[1],
        response1 : result[2],
        selectedExamModule : {}
      };
      const examModule: ExamModule = this.enrollmentService.getExamModules()[0];
      this.enrollmentService.setSelectedExamModule(examModule);
      finalResponse['selectedExamModule'] = examModule;

      return finalResponse;
    }));
    return of(true);
  }
}
