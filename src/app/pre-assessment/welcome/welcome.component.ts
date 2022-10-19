import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentAttempt, AttemptSave, ExamModule } from 'src/app/shared/interfaces/interfaces';
import { AssessmentAttemptService } from 'src/app/shared/services/assessment-attempt.service';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  numberOfQuestions: number = 0;
  constructor(private globalService: GlobalService, private enrollmentService: EnrollmentService, private router: Router, private assessmentAttemptService: AssessmentAttemptService) { }

  ngOnInit(): void {

    // log
    // LogService.activity('view preassessment');

    // scroll to top
    window.scrollTo(0, 0);

    this.globalService.selectedModule = {} as ExamModule;
    this.numberOfQuestions = 0;

    // remove loading
    this.globalService.hideLoader();

    /**
     * figure out how many questions we have
    */
    this.enrollmentService.getExamModules().forEach((examModule: ExamModule) => {
      this.numberOfQuestions += examModule.preassessmentQuestions;
    });

  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  start(): void {
    // show loading
    this.globalService.setLoaderMessage();;

    // update enrollment
    this.enrollmentService.getEnrollment().showPreAssessment = false;
    this.enrollmentService.update();

    const attempt: AttemptSave = {
      enrollmentId: this.enrollmentService.getEnrollment().id,
      type: 'pre'
    };

    // todo
    this.assessmentAttemptService.save(attempt).subscribe((collection: AssessmentAttempt) => {
      this.enrollmentService.setSelectedPreAssessmentAttempt(collection);
      this.router.navigate(['/pre-assessment/attempt']);
    });

  };

  getSelectedExamName(): string {
    return this.globalService?.selectedExam?.name;
  }

  goToMarketingSupportSite(): void {
    this.globalService.goToMarketingSupportSite();
  }

}
