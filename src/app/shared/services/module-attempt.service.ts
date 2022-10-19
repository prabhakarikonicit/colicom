import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PracticeAttempt, PracticeAttemptResponse, PracticeAttemptsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleAttemptService {

  constructor(private http: HttpService) { }
  queryForEnrollmentModulePractice(enrollmentId: number, moduleId: number) {
    return this.http.getData<PracticeAttemptsResponse>(`/enrollments/${enrollmentId}/modules/${moduleId}/practice-attempts`)
      .pipe(map((attempts: PracticeAttemptsResponse) => {
        return attempts.items;
      }));
  }

  queryForCreatingAnAttempt(attemptDetails:any) {
    return this.http.postData<PracticeAttemptResponse>(`/module-attempts`,attemptDetails)
    .pipe(map((attempt: PracticeAttemptResponse) => {
      return attempt.item;
    }));
  }

  update(moduleId: number, attempt: PracticeAttempt) {
    return this.http.putData<PracticeAttemptResponse>(`/module-attempts/${moduleId}`, attempt)
    .pipe(map((attempt: PracticeAttemptResponse) => {
      return attempt.item;
    }));
  }
}
