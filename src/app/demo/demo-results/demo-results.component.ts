import { Component, OnInit } from '@angular/core';
import { PracticeAttempt } from 'src/app/shared/interfaces/interfaces';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';

@Component({
  selector: 'app-demo-results',
  templateUrl: './demo-results.component.html',
  styleUrls: ['./demo-results.component.scss']
})
export class DemoResultsComponent implements OnInit {

  attempt:any;
  module:any;
  questionGroups:any = [];
  examModules:any = [];
  selectedExamModule:any;
  progress:any;
  progressQuestions:any = [];
  toggle:any;

  constructor(private globalService: GlobalService, private moduleService: ModuleService, private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {

    // global header
    this.globalService.selectedItem = 'demo';

    // remove loading
    this.globalService.hideLoader();

    this.attempt = this.moduleService.getAttempt();
    this.module = this.enrollmentService.getSelectedExamModule();

    // log
    // LogService.activity('demo attempt results', JSON.stringify({
    //     id: $scope.attempt.id,
    //     questionCount: $scope.attempt.questionCount,
    //     correct: $scope.attempt.correct,
    //     incorrect: $scope.attempt.incorrect,
    //     score: $scope.attempt.score,
    //     bookmarked: $scope.attempt.bookmarked,
    //     unbookmarked: $scope.attempt.unbookmarked,
    //     totalTime: $scope.attempt.totalTime
    // }));

    // progress
    this.progressQuestions = this.moduleService.getProgressQuestions();

    // for select dropdowns
    this.examModules = this.enrollmentService.getExamModules();

    // defaults
    this.selectedExamModule = this.enrollmentService.getSelectedExamModule();

    // var progress = PracticeService.getProgress();

    this.progress = {
        terms: this.attempt.questionCount,
        marked: this.attempt.bookmarked,
        missed: this.attempt.incorrect,
        score: this.attempt.score
    };
  }

  // tabs
  // openTab(value:any, count:number) {  
  //   // do nothing if 0 count of questions
  //   if (count === 0) {
  //       return;
  //   }

  //   // else lets check what we need to show
  //   switch (value) {
  //       case "bookmarked":
  //           this.toggle = 1;
  //           this.questionGroups = this.progressQuestions.filter((question:any) => {return question.bookmarked});
  //           break;
  //       case "incorrect":
  //           this.toggle = 2;
  //           this.questionGroups = this.progressQuestions.filter((question:any) => {return (question.answered === true && question.correct === false)});
  //           break;
  //       default: // all
  //           this.toggle = 3;
  //           this.questionGroups = this.progressQuestions;
  //   }
  // }

}
