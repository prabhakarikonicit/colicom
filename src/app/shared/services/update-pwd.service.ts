import { Injectable } from '@angular/core';
import { UserResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UpdatePwdService {

  constructor(private http: HttpService) { }
  updatePassword(email:string,password:string,code:string){
    return this.http.postData<UserResponse>('/auth/update-password', {  email: email,password: password,code: code })
    .pipe((user: any) => {return user;});

  }
}
