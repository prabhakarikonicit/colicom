import { Component, OnInit, Input } from '@angular/core';
import { AssessmentAttemptService } from '../../shared/services/assessment-attempt.service';
import { GlobalService } from '../../shared/services/global.service';
import { EnrollmentService } from '../../shared/services/enrollment.service';
import { Router } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { OrderByPipe } from 'src/app/shared/pipe/order-by.pipe';
import { environment } from 'src/environments/environment';
import { AssessmentAttempt, AssessmentAttemptsResponse } from 'src/app/shared/interfaces/interfaces';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { AssessmentService } from 'src/app/shared/services/assessment.service';


@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss']
})
export class AttemptComponent implements OnInit {

  progress: any;
  question: any;
  glossaryTerms: any;
  directiveConfig: any;
  index: any;
  exam: any;
  attempt: any;
  questionIndex: any;
  questionAttempts: any = [];
  questionAttempt:any;
  // track queue vars
  queuedQuestions:number = 0;
  pagination = {
    page: 1,
    pageSize: 20,
    pages: 0
  };
  // track if we are in a save process
  saving:boolean = false;
  sessionStartTime = Date.now();

  constructor(private assessmentAttemptService: AssessmentAttemptService, private globalService: GlobalService, private enrollmentService: EnrollmentService, private route: Router, private moduleService: ModuleService, private orderByPipe: OrderByPipe, private progressService: ProgressService, private assessmentService: AssessmentService) { }

  ngOnInit(): void {

    this.attempt = this.enrollmentService.getSelectedPreAssessmentAttempt();

    // has this attempt already been completed?
    if (this.attempt.completed !== null) {
      // leave and go to the feedback page
      this.route.navigate(['/pre-assessment/results']);
      return;
    }

    // question directive objects
    this.progress = {};
    this.question = {};
    this.glossaryTerms = [];
    this.directiveConfig = {
      showFeedback: false,
      showAnswer: false,
      showBookmark: false
    };

    this.exam = this.enrollmentService.getExam();
    this.questionIndex = -1;

    // ToDo : Log need to be enabled

    // based on attempt, do we might need to set a different page for api call
    if (this.attempt.correct !== 0 || this.attempt.incorrect !== 0) {
      this.pagination.page = Math.floor((this.attempt.correct + this.attempt.incorrect) / this.pagination.pageSize) + 1;
    }

    this.loadQuestions();

    this.globalService.hideLoader();

  }

  loadQuestions() {

    this.assessmentAttemptService.queryForAssessmentAttemptWithQuestions(this.attempt.id, this.pagination.page, this.pagination.pageSize).subscribe(collection => {
      collection.items = this.moduleService.sanitizeQuestions(collection.items);

      // need to check what page we are on so we can add to the questions array
      // enough padding so the indexes still work as they did before
      let empty = new Array((this.pagination.page - 1) * this.pagination.pageSize);
      let startIndex = empty.length + ((this.attempt.correct + this.attempt.incorrect) % this.pagination.pageSize);

      // order by sort and combine questions with padding array
      this.questionAttempts = empty.concat(this.orderByPipe.transform(collection.items, 'sort', false));

      // check for progress and forward the index
      for (let x = startIndex; x < this.questionAttempts.length; x++) {
        if (!this.questionAttempts[x].answered) {
          this.questionIndex = this.questionIndex + x;

          // fix to not having enough loaded when you resume on the last question of a page
          let modValue = (this.questionIndex + 1) % this.pagination.pageSize;
          if (this.questionIndex != -1 && ((modValue > (this.pagination.pageSize / 2)) || (modValue === 0)) &&
            this.questionAttempts.length < this.attempt.questionCount) {
            this.pagination.page++;
            this.loadNextAssessmentAttemptQuestion(this.pagination.page, this.pagination.pageSize);
          }

          this.next(true);
          return;
        }

        // add stats
        if (this.questionAttempts[x].correct) {
          this.attempt.correct++;
        } else {
          this.attempt.incorrect++;
        }
      }

      this.pagination.page++;
      if (this.pagination.page > this.pagination.pages) {
        return this.done();
      }

      this.loadQuestions();      
    });
  }

  save(path?:string) {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage("Saving...");

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    // save anything in queue
    this.assessmentService.bulkUpdateQueuedAssessmentAttemptQuestions()?.subscribe(result => {
      this.assessmentService.clearAssessmentAttemptQuestionUpdateQueue();
    });

    this.assessmentAttemptService.update(this.attempt, this.attempt.id).subscribe(collection => {
      this.enrollmentService.setSelectedPreAssessmentAttempt(collection);
    });

    // was a path set?
    path = typeof path !== 'undefined' ? path : '/dashboard';

    this.route.navigate([path]);
  }

  check(index: any) {
    // store user selection
    this.questionAttempt.answer = this.questionAttempt.question.answers[index].id;

    if (this.questionAttempt.question.answers[index].correct) {
        this.markCorrect();
    } else {
        this.markIncorrect();
    }
  }

  markCorrect() {
    if (this.questionAttempt.correct) {
      return;
    } else if (this.questionAttempt.incorrect) {
      this.attempt.incorrect--;
    }

    this.questionAttempt.correct = true;
    this.questionAttempt.incorrect = false;
    this.questionAttempt.answered = true;
    this.attempt.correct++;
  }

  markIncorrect() {
    if (this.questionAttempt.incorrect) {
      return;
    } else if (this.questionAttempt.correct) {
      this.attempt.correct--;
    }

    this.questionAttempt.incorrect = true;
    this.questionAttempt.correct = false;
    this.questionAttempt.answered = true;
    this.attempt.incorrect++;
  }

  next(resuming?: boolean) {

    // are we done?
    let isDone = (this.questionIndex + 1) == this.attempt.questionCount;

    if (this.questionIndex > -1 && !resuming) {
      // add to queue
      this.assessmentService.addToAssessmentAttemptQuestionUpdateQueue(this.questionAttempts[this.questionIndex]);
      this.queuedQuestions++;

      // add to queue
      if (this.queuedQuestions == environment.SAVE_EVERY_QUESTIONS || isDone) {
        this.assessmentService.bulkUpdateQueuedAssessmentAttemptQuestions()?.subscribe(result => {
          this.assessmentService.clearAssessmentAttemptQuestionUpdateQueue();
        });
        this.queuedQuestions = 0;
      }
    }

    // any more questions?
    if (isDone) {
      return this.done();
    }

    this.questionIndex++;
    this.questionAttempt = this.questionAttempts[this.questionIndex];
    this.questionAttempts[this.questionIndex].viewed = true;
    this.globalService.shuffleArray(this.questionAttempt.question.answers);

    // load next 10 every 8 questions
    // if this index is a multiple of 10 lets load the next 10
    const paginationIndex = this.questionIndex + 3;

    if (paginationIndex > 1 && paginationIndex % 10 === 0) {
      this.pagination.page++;
      this.loadNextAssessmentAttemptQuestion(this.pagination.page, this.pagination.pageSize);
    }

    // update question directive objects
    this.progress = {
      totalQuestions: this.attempt.questionCount,
      correct: this.attempt.correct,
      incorrect: this.attempt.incorrect
    };

    this.question = this.questionAttempt.question;
    this.question.bookmarked = this.questionAttempt.bookmarked;
    this.question.number = this.questionIndex + 1;
  }

  done() {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage("Saving...");

    // save attempt
    this.attempt.score = Math.round(this.attempt.correct / this.attempt.questionCount * 100);
    this.attempt.completed = Date.now() / 1000;

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    // store question attempts for feedback page
    this.enrollmentService.setQuestionAttempts(this.questionAttempts);

    this.assessmentAttemptService.update(this.attempt, this.attempt.id).subscribe((collection: any) => {
      this.updateProgresses(collection);
    });
  }
  
  updateProgresses(collection : AssessmentAttempt) {
    this.enrollmentService.setSelectedPreAssessmentAttempt(collection);

    let progresses = this.enrollmentService.getProgresses();
    let questions = this.enrollmentService.getQuestionAttempts();
    let progressesToUpdate:any = [];

    // only update progresses if there is no progress made so far
    // let cleanProgresses = $filter('filter')(progresses, { correct: "0", incorrect: "0", bookmarked: "0", attempts: "0" }, false);
    let cleanProgresses = progresses.filter(progress => progress.correct == 0 && progress.incorrect == 0 && progress.bookmarked == 0 && progress.attempts == 0);
    if (cleanProgresses.length !== progresses.length) {
        this.route.navigate(['pre-assessment/results']);
        return;
    }

    let examModules = this.enrollmentService.getExamModules();
    examModules.forEach(module => {
      let currentModule = module;
      let result = {
        name : module.name,
        correct : 0,
        incorrect: 0,
        totalQuestions: 0,
        sort: module.sort,
        moduleId: module.moduleId
      }

      // find progress
      let progress = progresses.filter(progress => progress.moduleId == module.moduleId && progress.type ==  'practice')[0];

      questions.forEach(question => {
        // ToDo : 4200 - check the if statement
        if (currentModule.moduleId !== module.moduleId) {
          return;
        }

        result.totalQuestions++;

        // found it
        if (question.correct) {
          result.correct++;
          progress.correct++;
        } else {
          result.incorrect++;
          progress.incorrect++;
        }
      })

      progress.score = Math.ceil(result.correct / result.totalQuestions * 25);
      progress.attempts++;

      progressesToUpdate.push(progress);

      // do a bulk update of all progresses
      this.progressService.bulkUpdate(this.enrollmentService.getEnrollment().id, progressesToUpdate).subscribe(collection => {
        this.route.navigate(['pre-assessment/results']);
      });

    });
  }

  loadNextAssessmentAttemptQuestion(page: number, pageSize: number) {
    this.assessmentAttemptService.queryForAssessmentAttemptWithQuestions(this.attempt.id, page, pageSize).subscribe(collection => {
      collection.items = this.moduleService.sanitizeQuestions(collection.items);
      this.questionAttempts = this.questionAttempts.concat(this.orderByPipe.transform(collection.items, 'sort', false));
    });
  }

}
