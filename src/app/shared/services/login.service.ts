import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { LoginRequestPayload, UserCredentials, User, UserResponse } from './../interfaces/interfaces';
import { EnrollmentService } from './enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUser: User = {} as User;
  examId: number = 0;
  constructor(private http: HttpService, private enrollmentService: EnrollmentService, private router: Router) { }

  showLogin(): void {
    this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    return Object.keys(this.currentUser).length > 0;
  }

  isSessionAlive(): boolean {
    const user: User = JSON.parse(localStorage.getItem('User') || '{}');
    return Object.keys(user).length > 0;
  }

  login(User: UserCredentials): Observable<User> {
    const body: LoginRequestPayload = {
      email: User.email,
      password: User.password,
      remember: true
    }

    return this.http.postData<UserResponse>('/auth/login', body)
      .pipe(map((user: UserResponse) => {
        localStorage.setItem('User', JSON.stringify(user.item));
        this.setCurrentUser(user.item);
        return user.item;
      }));
  }

  logout(): void {

    let redirectUrl: string = '';
    // where do we go? If org has redirect url, go there
    if (this.enrollmentService.getOrganization().redirectUrl !== null) {
      redirectUrl = this.enrollmentService.getOrganization().redirectUrl;
    }

    // remove user
    this.setCurrentUser({} as User);
    localStorage.clear();

    // let the server know we are logging out
    this.http.postData('/auth/logout', {}).subscribe(_ => {
      // where to?
      if (!!redirectUrl) {
        location.href = redirectUrl;
        return;
      }

      this.showLogin();
      return;
    });

  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getExamId(): number {
    return this.examId;
  }

  setExamId(examId: number): void {
    this.examId = examId;
  }

  redirect(url: string = ''): void {
    url = url || 'enrollment';
    this.router.navigate([url]);
  }

  validateUserSession(routePath: string) {
    if (this.isAuthenticated() && this.isSessionAlive() && routePath.includes('login')) {
      return false;
    } else if (!this.isAuthenticated() && !this.isSessionAlive() && !routePath.includes('login')) {
      this.showLogin();
      return false;
    } else if (!this.isAuthenticated() && this.isSessionAlive()) {
      const user: User = JSON.parse(localStorage.getItem('User') || '{}');
      this.setCurrentUser(user);
      this.redirect();
      return false;
    }
    return true;
  }

}
