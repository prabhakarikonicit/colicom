import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AssessmentAttempt, Enrollment } from '../interfaces/interfaces';
import { AssessmentAttemptService } from '../services/assessment-attempt.service';
import { EnrollmentService } from '../services/enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentAttemptsResolverService implements Resolve<any>  {

  constructor(private assessmentAttemptService: AssessmentAttemptService, private enrollmentService: EnrollmentService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const enrollment: Enrollment = this.enrollmentService.getEnrollment();
    return this.assessmentAttemptService.queryForEnrollment(enrollment.id).pipe(map((assessmentAttempts: AssessmentAttempt[]) => {

      const preAssessments: AssessmentAttempt[] = [];
      const exams: AssessmentAttempt[] = [];

      assessmentAttempts.forEach((module: AssessmentAttempt) => {
        if (module.type == 'pre') {
          preAssessments.push(module);
        } else if (module.type == 'simulatedexam') {
          exams.push(module);
        }
      });
      this.enrollmentService.setSimulatedExamAttempts(exams);
      this.enrollmentService.setPreAssessmentAttempts(preAssessments);
      return assessmentAttempts;
    }));
  }

}
