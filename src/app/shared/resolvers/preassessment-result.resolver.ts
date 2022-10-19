import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AssessmentAttemptService } from '../services/assessment-attempt.service';
import { EnrollmentService } from '../services/enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class PreassessmentResultResolver implements Resolve<boolean> {
  constructor(
    private assessmentAttemptService: AssessmentAttemptService,
    private enrollmentService: EnrollmentService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let attempt = this.enrollmentService.getSelectedPreAssessmentAttempt();
    // based on attempt, do we might need to set a different page for api call
    if (attempt.correct !== 0 || attempt.incorrect !== 0) {
    }
    return this.assessmentAttemptService.queryForAssessmentAttemptWithQuestions(attempt.id, 0, 0);
  }
}
