import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { AssessmentAttemptService } from '../../shared/services/assessment-attempt.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeAttempt, ProgressQuestion, ProgressQuestions } from 'src/app/shared/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { ModuleAttemptService } from 'src/app/shared/services/module-attempt.service';


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
  attempt = {} as PracticeAttempt;
  questionIndex: any;
  questionAttempts: any = [];
  questionAttempt: any;
  // track queue vars
  queuedQuestions: number = 0;
  pagination = {
    page: 1,
    pageSize: 20,
    pages: 0
  };
  inputAnswer: any;
  questionAnswered: boolean = false;
  examModule: any;
  progressQuestion = {} as ProgressQuestion;
  progressQuestions = {} as ProgressQuestions;
  // track if we are in a save process
  saving: boolean = false;
  sessionStartTime = Date.now();

  constructor(private globalService: GlobalService, private moduleService: ModuleService, private route: Router, private activatedRoute: ActivatedRoute, private enrollmentService: EnrollmentService, private assessmentAttemptService: AssessmentAttemptService, private moduleAttemptService: ModuleAttemptService) { }

  ngOnInit(): void {

    // global header
    this.globalService.selectedItem = 'practice';
    const resolverResponse = this.activatedRoute.snapshot.data['practiceAttemptResolverResponse'];

    this.questionAttempts = resolverResponse['moduleAttemptQuestionResponse'];
    this.glossaryTerms = resolverResponse['glossaryTerms'];

    this.attempt = this.moduleService.getAttempt();

    // has this attempt already been completed?
    if (this.attempt.completed !== null) {
      // leave and go to the feedback page
      this.route.navigate(['practice/results']);
      return;
    }

    // remove loading
    this.globalService.hideLoader();

    // question directive objects
    this.progress = {};
    this.question = {};
    this.glossaryTerms = [];
    this.directiveConfig = {
      showFeedback: true,
      showAnswer: true,
      showBookmark: true
    };

    this.questionIndex = -1;
    this.inputAnswer = {};
    this.questionAnswered = false;
    this.examModule = this.globalService.selectedModule;

    // log (ToDo)

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

  next(resuming?: boolean) {
    let questionAttempt = this.questionAttempts[this.questionIndex];

    // are we done?
    let isDone = (this.questionIndex + 1) == this.questionAttempts.length;

    if (this.questionIndex > -1 && !resuming) {
      //this.questionAttempts[this.questionIndex].view = this.viewType;

      // save question
      this.progressQuestions.viewed++;
      this.progressQuestions.answered = true;
      this.progressQuestions.correct = questionAttempt.correct;
      this.progressQuestions.bookmarked = questionAttempt.bookmarked;

      // // add  progressQuestion to questionAttempt in a copy, leave original alone
      let tempProgressQuestion = { ...this.progressQuestions };
      delete tempProgressQuestion.progress;
      tempProgressQuestion.question = {} as ProgressQuestion;
      questionAttempt.progressQuestion = tempProgressQuestion;

      // // add to queue
      this.moduleService.addToModuleAttemptQuestionUpdateQueue(questionAttempt);
      this.queuedQuestions++;

      // add to queue
      if (this.queuedQuestions == environment.SAVE_EVERY_QUESTIONS && !isDone) {
        let result = this.moduleService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();
        if (result != false) {
          result && result.subscribe((progressQuestions: any) => {
            this.queuedQuestions = 0;
          });
        }
      }
    }

    // any more questions?
    if (isDone) {
      // show loading
      this.globalService.setLoaderMessage('Saving..');

      this.queuedQuestions = 0;
      let result = this.moduleService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();
      if (result != false) {
        result && result.subscribe((progressQuestions: any) => {
          this.done();
          this.queuedQuestions = 0;
        });
      }
    } else {

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
    
  }

  done() {
    // in save state
    this.saving = true;

    // update attempt

    this.questionAttempts.forEach((question: any) => {
      if (question.bookmarked) {
        this.attempt.bookmarked++;
      }
    })

    // save attempt
    this.attempt.score = Math.round(this.attempt.correct / this.attempt.questionCount * 100);
    this.attempt.completed = Date.now() / 1000;

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    this.attempt.enrollmentId = this.enrollmentService.getEnrollment().id;
    this.attempt.moduleId = this.examModule.module.id;

    // rethink how/when to save these - make sure all questions are saved before this goes out
    // maybe send it all together as one call?
    this.moduleAttemptService.update(this.attempt.moduleId, this.attempt).subscribe(collection => {
      this.moduleService.setAttempt(collection);
      this.route.navigate(['practice/results']);
    });

  }

  bookmark() {
    if (this.questionAttempt.bookmarked) {
      this.questionAttempt.bookmarked = false;
      this.moduleService.getProgress().bookmarked--;
    } else {
      this.questionAttempt.bookmarked = true;
      this.moduleService.getProgress().bookmarked++;
    }
  }

  save(path?: string) {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage("Saving...");

    // save anything in queue
    let result = this.moduleService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();

    // was a path set?
    path = typeof path !== 'undefined' ? path : '/dashboard';

    // observable or false?
    if (result === false) {
      this.route.navigate([path]);
    } else {
      result && result.subscribe((response: any) => {
        this.route.navigate([path]);
      });
    }

  }

}
