import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PracticeAttemptsResponse } from '../interfaces/interfaces';
import { ModuleAttemptQuestionService } from '../services/module-attempt-question.service';
import { StudyService } from '../services/study.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleAttemptQuestionResolverService implements Resolve<any> {

  constructor(private moduleAttemptQuestionService: ModuleAttemptQuestionService, private studyService: StudyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.moduleAttemptQuestionService.queryForModuleAttempt(this.studyService.getAttempt().id);
  }

}