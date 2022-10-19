import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { Enrollment, Progress } from '../interfaces/interfaces';
import { EnrollmentService } from '../services/enrollment.service';
import { ProgressService } from '../services/progress.service';

@Injectable({
  providedIn: 'root'
})
export class PreAssessmentAttemptResolver implements Resolve<boolean> {

  constructor(private progressService: ProgressService, private enrollmentService: EnrollmentService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const enrollment: Enrollment = this.enrollmentService.getEnrollment();
    return this.progressService.query(enrollment.id)
      .pipe(map((progresses: Progress[]) => {
        this.enrollmentService.setProgresses(progresses);
      }));
  }
}
