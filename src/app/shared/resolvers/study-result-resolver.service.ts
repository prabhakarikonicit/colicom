import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StudyService } from '../services/study.service';
@Injectable({
  providedIn: 'root'
})
export class StudyResultResolverService implements Resolve<any>  {

  constructor(private studyService: StudyService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers();
  }

  loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers() {
    return this.studyService.loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers(this.studyService.getAttempt().id);
  }

}
