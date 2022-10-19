import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SimulatedexamAttemptComponent } from 'src/app/simulatedexam/simulatedexam-attempt/simulatedexam-attempt.component';
import { AssessmentAttemptService } from '../services/assessment-attempt.service';
import { EnrollmentService } from '../services/enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class SimulatedExamResolverService implements Resolve<any>  {

  constructor(private assessmentAttemptService: AssessmentAttemptService, private enrollmentService: EnrollmentService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.queryForAssessmentAttemptWithQuestions();
  }

  queryForAssessmentAttemptWithQuestions() {

    const attempt = this.enrollmentService.getSelectedSimulatedExamAttempt();
    return this.assessmentAttemptService.queryForAssessmentAttemptWithQuestions(attempt.id, 1, 500);
  }

}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<SimulatedexamAttemptComponent> {

  canDeactivate(component: SimulatedexamAttemptComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
    if (!component.saving) {
      component.save(nextState?.url);
      return false;
    }
    return true;
  }

}