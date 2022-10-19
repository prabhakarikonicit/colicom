import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class DemoResolver implements Resolve<boolean> {

  constructor(private enrollmentService : EnrollmentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let examModule = this.enrollmentService.getExamModules()[0];
    this.enrollmentService.setSelectedExamModule(examModule);
    return of(examModule);
  }
  
}
