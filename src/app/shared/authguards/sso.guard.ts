import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanLoad, Params, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { User, UserResponse } from '../interfaces/interfaces';
import { HttpService } from '../services/http.service';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class SsoGuard implements CanActivate {
  email: string = '';
  token: string = '';
  examId: string = '';

  constructor(private activeRoute: ActivatedRoute, private loginService: LoginService, private http: HttpService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    ({ email: this.email, token: this.token, examId: this.examId } = route.queryParams);

    return this.sso(this.email, this.token, this.examId)
      .pipe(
        map(
          (user: User) => {
            this.loginService.setCurrentUser(user);
            if (this.loginService.isAuthenticated()) {
              this.loginService.redirect();
            }
            return this.loginService.isAuthenticated();
          }
        ),
        catchError(err => { 
          console.log(err);
          this.loginService.showLogin();
          return of(false); 
        })
      )


  }
  sso(email: string, token: string, examId: string) {

    // store exam id for auto start
    if (examId) {
      this.loginService.setExamId(parseInt(examId));
    };

    return this.http.postData<UserResponse>('/auth/login-sso', { email: email, token: token })
      .pipe(map((data: UserResponse) => {
        return data.item;
      }));
  }
}
