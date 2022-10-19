import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ExamModule, Progress, User } from '../interfaces/interfaces';
import { EnrollmentService } from '../services/enrollment.service';
import { LoginService } from '../services/login.service';
import { StudyService } from '../services/study.service';
@Injectable({
  providedIn: 'root'
})
export class StudyResolverService implements Resolve<any>  {

  constructor(private loginService: LoginService, private enrollmentService: EnrollmentService, private studyService: StudyService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.loadProgressQuestionsForExamModuleWithQuestionsAndAnswers();
  }

  loadProgressQuestionsForExamModuleWithQuestionsAndAnswers() {
    const examModule: ExamModule = this.enrollmentService.getSelectedExamModule();
    const progresses: Progress[] = this.enrollmentService.getProgresses();
    const progress: Progress = progresses.filter((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === 'study')[0];
    // store progress
    this.studyService.setProgress(progress);

    return this.studyService.loadProgressQuestionsForExamModuleWithQuestionsAndAnswers(examModule, 'study');
  }

}
