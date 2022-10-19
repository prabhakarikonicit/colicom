import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AssessmentAttemptsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class AssessmentAttemptQuestionService {

  constructor(private http: HttpService) { }


  queryForAssessmentAttemptWithQuestions(assessmentAttemptId: number, page: number, pageSize: number) {
    return this.http.getData<AssessmentAttemptsResponse>(`/assessment-attempts/${assessmentAttemptId}/question-attempts?includes[]=question&includes[]=question.answers&page=${page}&pageSize=${pageSize}`)
      .pipe(map((collection: AssessmentAttemptsResponse) => {
        return collection;
      }))
  }

  queryForModuleAttempt(moduleAttemptId: number) {
    return this.http.getData(`/module-attempts/${moduleAttemptId}/question-attempts`)
      .pipe(map((questionAttempts: any) => {
        return questionAttempts.items;
      }));
  }

  bulkUpdate(assessmentAttemptId: number, queuedAssessmentAttemptQuestions: any) {
    return this.http.putData(`/assessment-attempts/${assessmentAttemptId}/question-attempts`, queuedAssessmentAttemptQuestions)
    .pipe(map((questionAttempts: any) => {
      return questionAttempts.items;
    }));
  }


  update(assessmentAttemptId: number, assessmentAttemptQuestionId: number, question: any) {
    return this.http.putData(`/assessment-attempts/${assessmentAttemptId}/question-attempts/${assessmentAttemptQuestionId}?id=${assessmentAttemptQuestionId}`, question)
    .pipe(map((questionAttempts: any) => {
      return questionAttempts.items;
    }));
  }

}
