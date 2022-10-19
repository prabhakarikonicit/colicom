import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamModule, Result } from 'src/app/shared/interfaces/interfaces';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  attempt: any;
  questionAttempts: any;
  results: Result[] = [];
  toggle: number = 0;
  allQuestions: any = {};
  selectedItem = 'pre-assessment';
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private enrollmentService: EnrollmentService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.globalService.hideLoader();
    this.globalService.selectedModule = {} as ExamModule;

    this.attempt = this.enrollmentService.getSelectedPreAssessmentAttempt();
    this.allQuestions = this.activatedRoute.snapshot.data['AssessmentAttemptWithQuestions'];
    this.questionAttempts = this.allQuestions.items;
    this.results = [];

    // tally up results
    const examModules = this.enrollmentService.getExamModules();

    examModules.forEach((exam) => {
      const result: Result = {
        name: exam.name,
        correct: 0,
        incorrect: 0,
        bookmarked: 0,
        total: 0,
        sort: exam.sort,
        questionAttempts: [],
        categoryOpen: false
      };
      result.name = exam.name;

      // loop through all questions and find the ones for this module
      this.questionAttempts.forEach((question: any) => {
        if (exam.moduleId != question.moduleId) {
          return; // continue
        }

        // found it
        if (question.correct) {
          result.correct++;
        } else {
          result.incorrect++;
        }

        if (question.bookmarked) {
          result.bookmarked++;
        }

        result.total++;

        // add question to results
        result.questionAttempts.push(question);
      });

      this.results.push(result);
    });
    // default view by category tab
    this.toggle = 3;
    // scroll to top
    window.scrollTo(0, 0);
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
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
    this.results.forEach((value) => {
      if (type == 'bookmarked' && value.bookmarked > 0) {
        value.categoryOpen = true;
      } else if (type == 'incorrect' && value.incorrect > 0) {
        value.categoryOpen = true;
      } else {
        value.categoryOpen = false;
      }
    });
  };
  print() {
    window.print();
  }
}
