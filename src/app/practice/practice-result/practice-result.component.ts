import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ProgressQuestionManagerService } from 'src/app/shared/services/progress-question-manager.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { PracticeAttemptService } from 'src/app/shared/services/practice-attempt.service';
@Component({
  selector: 'app-practice-result',
  templateUrl: './practice-result.component.html',
  styleUrls: ['./practice-result.component.scss']
})
export class PracticeResultComponent implements OnInit {
  attempt: any;
  progress: any;
  toggle: number = 0;
  progressQuestion: any;
  questionGroups: any[] = [];
  module: any;
  progressQuestions: any;
  examModules: any;
  selectedExamModule: any;

  constructor(
    private enrollmentService: EnrollmentService,
    private globalService: GlobalService,
    private moduleService: ModuleService,
    public pqManager: ProgressQuestionManagerService,
    private activatedRoute: ActivatedRoute,
    private practiceAttemptService: PracticeAttemptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.attempt = this.moduleService.getAttempt();

    this.globalService.hideLoader(); // remove loading
    this.module = this.enrollmentService.getSelectedExamModule();

    this.progressQuestions = this.moduleService.getProgressQuestions(); // progress
    // for select dropdowns
    this.examModules = this.enrollmentService.getExamModules();

    // defaults
    this.selectedExamModule = this.enrollmentService.getSelectedExamModule();

    this.progress = this.moduleService.getProgress();

    this.progress = {
      terms: this.attempt.questionCount,
      marked: this.attempt.bookmarked,
      missed: this.attempt.incorrect,
      score: this.attempt.score
    };
    this.activatedRoute.data.subscribe((e) => {
      this.openTab('bookmarked', this.attempt.bookmarked)
    });
  }
  // tabs
  openTab(value: any, count: any) {
    // do nothing if 0 count of questions
    if (count === 0) {
      return;
    }

    // else lets check what we need to show
    switch (value) {
      case "bookmarked":
        this.toggle = 1;
        this.questionGroups = this.globalService.filterKeyVal(this.progressQuestions, { bookmarked: true });
        break;
      case "incorrect":
        this.toggle = 2;
        this.questionGroups = this.globalService.filterKeyVal(this.progressQuestions, { answered: true, correct: false });
        break;
      default: // all
        this.toggle = 3;
        this.questionGroups = this.progressQuestions;
    }
  };
  start() {
    // show loading
    this.globalService.showLoader();

    this.moduleService.createAttempt(
      this.enrollmentService.getEnrollment().id,
      this.selectedExamModule.module.id,
      'practice',
      this.selectedExamModule.practiceQuestions, ''
    ).subscribe((newAttempt: any) => {
      this.moduleService.setAttempt(newAttempt);
      this.router.navigate(['practice/attempt']);
    });
  };

  bookmark(progressQuestion: any) {
    // update tabs
    if (progressQuestion.bookmarked) {
      this.progress.marked--;
      this.progress.bookmarked = this.progress.bookmarked <= 0 ? 0 : this.progress.bookmarked - 1;
    } else {
      this.progress.marked++;
      this.progress.bookmarked++;
    }

    this.moduleService.bookmarkProgressQuestion(progressQuestion, this.progress);
  };

  print() {
    window.print();
  }
}
