import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exam, ExamModule, PracticeAttempt } from '../shared/interfaces/interfaces';
import { AssessmentAttemptService } from '../shared/services/assessment-attempt.service';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-simulatedexam',
  templateUrl: './simulatedexam.component.html',
  styleUrls: ['./simulatedexam.component.scss']
})
export class SimulatedexamComponent implements OnInit {

  examModules: ExamModule[] = [];
  exam: Exam = {} as Exam;
  attempts: any;

  examTime: number = 0;
  totalQuestions: number = 0;
  currentAttemptsPage: number = 0;
  attemptsToDisplay: number = 0;
  displayTheseAttempts: any = [];

  constructor(private globalService: GlobalService, private enrollmentService: EnrollmentService,
    private assessmentAttemptService: AssessmentAttemptService, private router: Router) { }

  ngOnInit(): void {

    // log
    // LogService.activity('view simulated exam');

    // scroll to top
    window.scrollTo(0, 0);

    // global header
    this.globalService.selectedItem = 'simulated-exam';
    this.globalService.selectedModule = {} as ExamModule;

    // remove loading
    this.globalService.hideLoader();

    this.examModules = this.enrollmentService.getExamModules();
    //this.module = this.globalService.selectedModule;
    this.exam = this.enrollmentService.getExam();
    this.examTime = Math.floor(this.exam.examTime / 60);
    this.attempts = [];// this.enrollmentService.getSimulatedExamAttempts();

    // figure out total question
    this.totalQuestions = 0;
    this.examModules.forEach((examModule: ExamModule) => {
      this.totalQuestions += examModule.examQuestions;
    });

    // get all attempts
    this.assessmentAttemptService.queryForEnrollmentSimulatedExam(this.enrollmentService.getEnrollment().id).subscribe((simulatedExamAttempts: PracticeAttempt[]) => {
      if (simulatedExamAttempts.length === 0) {
        this.attempts = [];
        return;
      }
      this.attempts = simulatedExamAttempts;
      // display attempts
      this.displayAttempts(1);
    });

    // displaying attempts
    this.currentAttemptsPage = 1;
    this.attemptsToDisplay = 3;
    this.displayTheseAttempts = [];
  }

  displayAttempts(page: number): void | any { // 4200
    if (typeof (page) !== "undefined") {
      this.currentAttemptsPage = page;
    }

    if (this.attempts.length === 0) {
      return [];
    }

    const startIndex = (this.currentAttemptsPage - 1) * this.attemptsToDisplay;
    const endIndex = startIndex + this.attemptsToDisplay;
    this.displayTheseAttempts = this.attempts.slice(startIndex, endIndex);
  }

  displayPreviousAttempts() {
    if (this.currentAttemptsPage == 1) {
      return;
    }

    return this.displayAttempts(this.currentAttemptsPage - 1);
  }

  displayNextAttempts() {
    return this.displayAttempts(this.currentAttemptsPage + 1);
  }

  isLessAttempts() {
    return this.currentAttemptsPage !== 1;
  }

  isMoreAttempts() {
    return ((this.currentAttemptsPage * this.attemptsToDisplay) < this.attempts.length);
  }

  start(): void {
    // show loading
    this.globalService.showLoader();

    const attempt = {
      enrollmentId: this.enrollmentService.getEnrollment().id,
      type: "simulatedexam"
    };

    this.assessmentAttemptService.save(attempt).subscribe((assessmentAttempt: PracticeAttempt) => {
      this.enrollmentService.setSelectedSimulatedExamAttempt(assessmentAttempt);
      this.router.navigate(['simulated-exam', 'attempt']);

    })

  }

  resume(attempt: any) {
    this.globalService.showLoader();

    this.enrollmentService.setSelectedSimulatedExamAttempt(attempt);
    this.router.navigate(['simulated-exam', 'attempt']);
  }

  review(attempt: any) {
    this.globalService.showLoader();

    this.enrollmentService.setSelectedSimulatedExamAttempt(attempt);
    this.router.navigate(['simulated-exam', 'results']);
  }

}
