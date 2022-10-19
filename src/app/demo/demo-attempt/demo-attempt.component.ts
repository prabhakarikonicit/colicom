import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Router } from '@angular/router';
import { ProgressQuestion, ProgressQuestions } from 'src/app/shared/interfaces/interfaces';
import { OrderByPipe } from 'src/app/shared/pipe/order-by.pipe';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';


@Component({
  selector: 'app-demo-attempt',
  templateUrl: './demo-attempt.component.html',
  styleUrls: ['./demo-attempt.component.scss']
})
export class DemoAttemptComponent implements OnInit {
  
  progress: any;
  question: any;
  glossaryTerms: any = [];
  directiveConfig: any;
  attempt: any;
  sessionStartTime: any = Date.now();
  questionIndex: number = 0;
  inputAnswer: any;
  questionAnswered:boolean = false;
  examModule:any;
  // track if we are in a save process
  saving: boolean = false;

  // track queue vars
  queuedQuestions: number = 0;
  progressQuestion = {} as ProgressQuestion;
  progressQuestions = {} as ProgressQuestions;
  questionAttempts: any = [];
  viewType: any;
  questionAttempt: any;

  constructor(private globalService: GlobalService, private activatedRoute: ActivatedRoute, private moduleService: ModuleService, private router: Router, private orderByPipe: OrderByPipe, private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {

    const DemoAttemptResolverResponse = this.activatedRoute.snapshot.data['DemoAttemptResolverResponse'];

    this.attempt = this.moduleService.getAttempt();
    // has this attempt already been completed?
    if (this.attempt.completed !== null) {
    // leave and go to the feedback page
      this.router.navigate(['demo/results']);
      return;
    }

    // remove loading
    this.globalService.hideLoader();
    // question directive objects
    this.progress = {};
    this.question = {};
    this.glossaryTerms = DemoAttemptResolverResponse['glossaryTerms'];
    this.directiveConfig = {
      showFeedback: true,
      showAnswer: true,
      showBookmark: true
    };

    this.questionIndex = -1;
    this.inputAnswer = {};
    this.questionAnswered = false;
    
    // ToDo : migrate code from next statement
    this.examModule = DemoAttemptResolverResponse['selectedExamModule'];
    
    // order attempts by sort
    this.questionAttempts = this.orderByPipe.transform(DemoAttemptResolverResponse['moduleAttemptQuestionResponse'], 'sort', false);
    this.enrollmentService.setQuestionAttempts(this.questionAttempts);

    // rest vars
    this.attempt.correct = 0;
    this.attempt.incorrect = 0;

    // check for progress and forward the index
    for (let x = 0; x < this.questionAttempts.length; x++) {
        if (!this.questionAttempts[x].answered) {
            this.questionIndex = this.questionIndex + x;
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

    this.next();
  }

  check(index: number) {
    // store user selection
    this.questionAttempt.answer = this.progressQuestions.question.answers[index].id;

    if (this.progressQuestions.question.answers[index].correct) {
        this.markCorrect();
    } else {
        this.markIncorrect();
    }
  }

  next(resuming?:boolean) {
    
    let questionAttempt = this.questionAttempts[this.questionIndex];

    // are we done?
    let isDone = (this.questionIndex + 1) == this.questionAttempts.length;

    if (this.questionIndex > -1 && !resuming) {
        this.questionAttempts[this.questionIndex].view = this.viewType;

        // save question
        this.progressQuestions.viewed++;
        this.progressQuestions.answered = true;
        this.progressQuestions.correct = questionAttempt.correct;
        this.progressQuestions.bookmarked = questionAttempt.bookmarked;

        // add  progressQuestion to questionAttempt in a copy, leave original alone
        var tempProgressQuestion = { ...this.progressQuestions };
        delete tempProgressQuestion.progress;
        tempProgressQuestion.question = {} as ProgressQuestion;
        questionAttempt.progressQuestion = tempProgressQuestion;

    }

    // any more questions?
    if (isDone) {
        // show loading
        this.globalService.showLoader();

        this.queuedQuestions = 0;
        return this.done();
    }

    this.questionIndex++;
    this.questionAttempt = this.questionAttempts[this.questionIndex];
    this.questionAttempts[this.questionIndex].viewed++;

    // if here, move to next index - find progress question
    this.progressQuestions = this.moduleService.getProgressQuestions().filter(progressQuestions => {
      return progressQuestions.questionId == this.questionAttempt.questionId;
    })[0];

    this.questionAttempt.bookmarked = this.progressQuestions.bookmarked;

    this.globalService.shuffleArray(this.progressQuestions.question.answers);

    // update question directive objects
    this.progress = {
        totalQuestions: this.attempt.questionCount,
        correct: this.attempt.correct,
        incorrect: this.attempt.incorrect
    };

    this.question = this.progressQuestions.question;
    this.question.bookmarked = this.questionAttempt.bookmarked;
    this.question.number = this.questionIndex + 1;
    this.question.moduleName = this.examModule.name;
  }

  done() {
    // in save state
    this.saving = true;

    // update attempt
    this.questionAttempts.forEach((question:any) => {
      if(question.bookmarked) {
        this.attempt.bookmarked++;
      }
    });

    // save attempt
    this.attempt.score = Math.round(this.attempt.correct / this.attempt.questionCount * 100);
    this.attempt.completed = Date.now() / 1000;

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    this.attempt.enrollmentId = this.enrollmentService.getEnrollment().id;
    this.attempt.moduleId = this.examModule.module.id;

    // rethink how/when to save these - make sure all questions are saved before this goes out
    // maybe send it all together as one call?
    //ModuleAttempt.update($scope.attempt, function (collection) {
    //    PracticeService.setAttempt(collection.item);
    this.moduleService.setAttempt(this.attempt);
    this.router.navigate(['demo/results']);
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

  bookmark() {
    if (this.questionAttempt.bookmarked) {
        this.questionAttempt.bookmarked = false;
    } else {
        this.questionAttempt.bookmarked = true;
    }
  }

  save(path?:string) {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage('Saving...');

    // save anything in queue
    //var result = PracticeService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();

    // was a path set?
    path = typeof path !== 'undefined' ? path : '/dashboard';

    // promise or false?
    // if (result === false) {
    //     $location.path(path);
    // } else {
    //     result.then(function () {
    //         $location.path(path);
    //     });
    // }
    this.router.navigate([path]);

  }

}
