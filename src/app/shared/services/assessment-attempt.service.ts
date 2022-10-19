import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AssessmentAttempt, AttemptSave, PracticeAttemptResponse, PracticeAttemptsResponse, AssessmentAttemptsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentAttemptService {

  callingComponent: string = '';

  constructor(private http: HttpService) { }

  queryForEnrollmentPreAssessment(enrollmentId: number) {
    return this.http.getData<PracticeAttemptsResponse>(`/enrollments/${enrollmentId}/pre-assessment-attempts`)
      .pipe(map((preAssessmentAttempts: PracticeAttemptsResponse) => {
        return preAssessmentAttempts.items;
      }));
  }

  // Todo: 4200 - need to move to AssessmentAttemptQuestionService service
  queryForAssessmentAttemptWithQuestions(assessmentAttemptId: number, page: number, pageSize: number) {
    return this.http.getData<AssessmentAttemptsResponse>(`/assessment-attempts/${assessmentAttemptId}/question-attempts?includes[]=question&includes[]=question.answers&page=${page}&pageSize=${pageSize}`)
      .pipe(map((collection: AssessmentAttemptsResponse) => {
        return collection;
      }))
  }

  queryForEnrollment(enrollmentId: number) {
    return this.http.getData<PracticeAttemptsResponse>(`/enrollments/${enrollmentId}/assessment-attempts`)
      .pipe(map((assessmentAttempts: PracticeAttemptsResponse) => {
        return assessmentAttempts.items;
      }));
  }

  queryForEnrollmentSimulatedExam(enrollmentId: number) {
    return this.http.getData<PracticeAttemptsResponse>(`/enrollments/${enrollmentId}/simulated-exam-attempts`)
      .pipe(map((simulatedExamAttempts: PracticeAttemptsResponse) => {
        return simulatedExamAttempts.items;
      }));
  }

  save(attempt: AttemptSave) {
    // Todo: 4200 check for logic again
    return this.http.postData<PracticeAttemptResponse>(`/assessment-attempts`, attempt)
      .pipe(map((assessmentAttempts: PracticeAttemptResponse) => {
        return assessmentAttempts.item;
      }));
  }

  update(attempt: AssessmentAttempt, id: number) {
    // Todo: 4200 check for logic again
    return this.http.putData<any>(`/assessment-attempts/${id}`, attempt)
      .pipe(map((assessmentAttempt: any) => {
        return assessmentAttempt.item;
      }));
  }

}
