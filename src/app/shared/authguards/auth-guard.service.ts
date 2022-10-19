import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { User } from '../interfaces/interfaces';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad {
  constructor(private loginService: LoginService) {
  }
  canLoad(route: Route): boolean {
    return this.loginService.validateUserSession(route.path as string);
  }
} 