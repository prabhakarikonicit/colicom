import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/interfaces';
import { EnrollmentService } from '../services/enrollment.service';
import { LoginService } from '../services/login.service';
@Injectable({
  providedIn: 'root'
})
export class EnrollmentResolverService implements Resolve<any>  {

  constructor(private loginService: LoginService, private enrollmentService: EnrollmentService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const currentUser: User = this.loginService.getCurrentUser();
    return this.enrollmentService.loadEnrollments(currentUser.id);
  }

}
