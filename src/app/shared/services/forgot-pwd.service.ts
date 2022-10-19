import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { UserResponse } from '../interfaces/interfaces';
import { GlobalService } from './global.service';
import { HttpService } from './http.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPwdService {
  constructor(private http: HttpService, private loginService: LoginService) { }


  requestPasswordReset(email: string) {
    return this.http.postData<UserResponse>('/auth/request-password-reset', { email: email })
      .pipe((user: any) => {return user;});
  }
} 
