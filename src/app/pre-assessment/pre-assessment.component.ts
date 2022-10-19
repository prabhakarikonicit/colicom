import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { AssessmentAttemptService } from '../shared/services/assessment-attempt.service';
import { LoginService } from '../shared/services/login.service';
import { Router } from '@angular/router';
import { ModuleService } from '../shared/services/module.service';
import { OrderByPipe } from '../shared/pipe/order-by.pipe';
import { ExamModule, AssessmentAttempt } from '../shared/interfaces/interfaces';

@Component({
  selector: 'app-pre-assessment',
  templateUrl: './pre-assessment.component.html',
  styleUrls: ['./pre-assessment.component.scss']
})
export class PreAssessmentComponent implements OnInit {

  attempts:any = [];
  examModules:any ;
  exam: any;
  totalQuestions: number = 0;
  examTime: any;
  enrollment: any;
  attempt:any;
  questionIndex:any;
  questionAttempts:any = [];

  constructor(private loginService: LoginService, private globalService : GlobalService, private enrollmentService : EnrollmentService, private assessmentAttemptService : AssessmentAttemptService, private route: Router, private moduleService:ModuleService, private orderBy:OrderByPipe) { }

  ngOnInit(): void {
    
   // global header
   this.globalService.selectedItem = 'pre-assessment';
   this.globalService.selectedModule = {} as ExamModule;

   this.examModules = this.enrollmentService.getExamModules();
   this.exam = this.enrollmentService.getExam();
  
   // figure out total question
   this.examModules.forEach((module: any) => {
    this.totalQuestions += module['preassessmentQuestions'];
   });

   this.examTime = Math.round(this.totalQuestions * 1.5);

   this.enrollment = this.enrollmentService.getEnrollment();

   const user = this.loginService.getCurrentUser();

   // get all attempts
   this.assessmentAttemptService.queryForEnrollmentPreAssessment(this.enrollment.id).subscribe(collection => {
      this.attempts = collection.length === 0 ? [] : collection;
      // loading end
      this.globalService.hideLoader();
   });

  }

  resume(attempt:AssessmentAttempt) {
    this.globalService.showLoader();
    this.enrollmentService.setSelectedPreAssessmentAttempt(attempt);
    this.route.navigate(['pre-assessment/attempt']);
  }

  review(attempt:any) {
    this.enrollmentService.setSelectedPreAssessmentAttempt(attempt);
    this.globalService.showLoader();
    this.route.navigate(['pre-assessment/results']);
  }

  start() {
    // show loading
    this.globalService.showLoader();

    // update enrollment
    this.enrollmentService.getEnrollment().showPreAssessment = false;
    this.enrollmentService.update();

    const attempt = {
        enrollmentId: this.enrollmentService.getEnrollment().id,
        type: "pre"
    };

    this.assessmentAttemptService.save(attempt).subscribe(newAttempt => {
      this.enrollmentService.setSelectedPreAssessmentAttempt(newAttempt);
      this.route.navigate(['pre-assessment/attempt']);
    });
  }

}
