import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { EnrollmentService } from '../services/enrollment.service';
import { GlobalService } from '../services/global.service';
import { ModuleService } from '../services/module.service';

EnrollmentService
@Injectable({
  providedIn: 'root'
})
export class PracticeResolverService implements Resolve<any> {
  
  constructor(private moduleService:ModuleService, private enrollmentService:EnrollmentService, private globalService:GlobalService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let selectedExamModule = this.enrollmentService.getSelectedExamModule();
    

     // store progress
     this.moduleService.setProgress(this.globalService.filterKeyVal(this.enrollmentService.getProgresses(), {
        moduleId: selectedExamModule.moduleId,
        type: 'practice'
      })[0]);
    return this.moduleService.loadProgressQuestionsForExamModuleWithQuestionsAndAnswers(selectedExamModule, 'practice', {bookmarked: true})
    
  }
}
