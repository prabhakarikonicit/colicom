import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentAttempt, AssessmentAttemptsResponse, ExamModule, PracticeAttempt } from 'src/app/shared/interfaces/interfaces';
import { AssessmentAttemptService } from 'src/app/shared/services/assessment-attempt.service';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-simulatedexam-results',
  templateUrl: './simulatedexam-results.component.html',
  styleUrls: ['./simulatedexam-results.component.scss']
})
export class SimulatedexamResultsComponent implements OnInit {

  attempt: AssessmentAttempt = {} as AssessmentAttempt;
  questionAttempts: AssessmentAttempt[] = [];
  results: any;
  toggle: number = 0;

  constructor(private globalService: GlobalService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private assessmentAttemptService: AssessmentAttemptService,
    private router: Router) { }

  ngOnInit(): void {

    // global header
    this.globalService.selectedItem = 'simulated-exam';
    this.globalService.selectedModule = {} as ExamModule;

    // remove loading
    this.globalService.hideLoader();

    // scroll to top
    window.scrollTo(0, 0);

    this.attempt = this.enrollmentService.getSelectedSimulatedExamAttempt();
    this.questionAttempts = (this.route.snapshot.data['allQuestions'] as AssessmentAttemptsResponse).items;
    this.results = [];

    // log
    // LogService.activity('simulated exam attempt results', JSON.stringify({
    //   id: this.attempt.id,
    //   questionCount: this.attempt.questionCount,
    //   correct: this.attempt.correct,
    //   incorrect: this.attempt.incorrect,
    //   score: this.attempt.score,
    //   bookmarked: this.attempt.bookmarked,
    //   totalTime: this.attempt.totalTime
    // }));

    // tally up results
    const examModules = this.enrollmentService.getExamModules();
    examModules.forEach((examModule: ExamModule) => {

      const result = {
        name: examModule.name,
        correct: 0,
        incorrect: 0,
        bookmarked: 0,
        total: 0,
        sort: examModule.sort,
        questionAttempts: [] as any,
        categoryOpen: false
      };
      result.name = examModule.name;

      // loop through all questions and find the ones for this module
      this.questionAttempts.forEach((questionAttempt: any) => {

        if (examModule.moduleId != questionAttempt.moduleId) {
          return; // continue
        }

        // found it
        if (questionAttempt.correct) {
          result.correct++;
        } else {
          result.incorrect++;
        }

        if (questionAttempt.bookmarked) {
          result.bookmarked++;
        }

        result.total++;

        // add question to results
        result.questionAttempts.push(questionAttempt);
      });

      this.results.push(result);

    });

    // default view by category tab
    this.toggle = 3;

  }

  start() {
    // show loading
    this.globalService.showLoader();

    const attempt = {
      enrollmentId: this.enrollmentService.getEnrollment().id,
      type: "simulatedexam"
    };

    this.assessmentAttemptService.save(attempt).subscribe((collection: PracticeAttempt) => {
      this.enrollmentService.setSelectedSimulatedExamAttempt(collection);
      this.router.navigate(['simulated-exam', 'attempt']);
    });

  }

  /**
   * Logic to decide what categories to collapse and expand
   *
   * Clicking on a tab should open the categories that have questions of that type and default to
   * close all other categories. View by categories should default to all closed as well.
   *
   * @param type string
   */
  expandCategories(type?: string) {
    // collapse
    this.results.forEach((value: any) => {
      if (type == 'bookmarked' && value.bookmarked > 0) {
        value.categoryOpen = true;
      } else if (type == 'incorrect' && value.incorrect > 0) {
        value.categoryOpen = true;
      } else {
        value.categoryOpen = false;
      }
    });
  }

  print() {
    window.print();
  }
  
}
