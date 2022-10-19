import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ModuleService } from '../services/module.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeResultResolver implements Resolve<boolean> {
  constructor(private moduleService:ModuleService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.moduleService.loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers(this.moduleService.getAttempt().id);
  }
}
