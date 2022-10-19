import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PracticeAttemptsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';
import { StudyService } from './study.service';


@Injectable({
  providedIn: 'root'
})
export class ModuleAttemptQuestionService {

  constructor(private http: HttpService) { }
  
  bulkUpdate(moduleAttemptId: number, queuedModuleAttemptQuestions: any[]) {
    return this.http.putData(`/module-attempts/${moduleAttemptId}/question-attempts`, queuedModuleAttemptQuestions);
  }

  queryForModuleAttempt(moduleAttemptId:number) {
    return this.http.getData(`/module-attempts/${moduleAttemptId}/question-attempts`)
    .pipe(map((questionAttemptResponse: any) => {
      return questionAttemptResponse.items;
    }));
  }

}

