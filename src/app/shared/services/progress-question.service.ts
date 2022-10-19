import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Enrollment, ProgressDetailsResponse, ProgressQuestionResponse, ProgressQuestions, ProgressQuestionsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressQuestionService {

  constructor(private http: HttpService) { }
  queryForProgressWithQuestionsAndAnswers(enrollment: Enrollment, progressId: number) {
    return this.http.getData<ProgressDetailsResponse>(`/enrollments/${enrollment.id}/progresses/${progressId}/details`)
      .pipe(map((progressDetails: ProgressDetailsResponse) => {
        return progressDetails.items;
      }));
  }

  queryForModuleAttemptWithQuestionsAndAnswers(moduleAttemptId: number) {
    return this.http.getData<ProgressQuestionsResponse>(`/module-attempts/${moduleAttemptId}/progress-questions`)
      .pipe(map((progressDetails: ProgressQuestionsResponse) => {
        return progressDetails.items;
      }));
  }

  update(progressQuestion: ProgressQuestions, enrollmentId: number) {
    return this.http.putData<ProgressQuestionResponse>(`/enrollments/${enrollmentId}/progresses/${progressQuestion.progressId}/questions/${progressQuestion.id}`, progressQuestion)
    .pipe(map((attempt: ProgressQuestionResponse) => {
      return attempt.item;
    }));
  }

}
