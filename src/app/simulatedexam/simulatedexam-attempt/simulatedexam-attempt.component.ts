import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentAttempt, AssessmentAttemptsResponse, ExamModule } from 'src/app/shared/interfaces/interfaces';
import { OrderByPipe } from 'src/app/shared/pipe/order-by.pipe';
import { AssessmentAttemptService } from 'src/app/shared/services/assessment-attempt.service';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SimulatedExamService } from 'src/app/shared/services/simulated-exam.service';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-simulatedexam-attempt',
  templateUrl: './simulatedexam-attempt.component.html',
  styleUrls: ['./simulatedexam-attempt.component.scss']
})
export class SimulatedexamAttemptComponent implements OnInit, OnDestroy {

  @ViewChild('cd', { static: false }) countdown!: CountdownComponent;

  attempt: AssessmentAttempt = {} as AssessmentAttempt;
  questionAttempts: AssessmentAttempt[] = [];
  progress: any;
  question: any;
  glossaryTerms: any;
  directiveConfig: any;
  exam: any;
  questionIndex: any;
  saving: boolean = false;
  sessionStartTime: any;
  questionAttempt: any;

  constructor(private globalService: GlobalService,
    private enrollmentService: EnrollmentService,
    private router: Router,
    private route: ActivatedRoute,
    private simulatedExamService: SimulatedExamService,
    private assessmentAttemptService: AssessmentAttemptService,
    private orderBy: OrderByPipe
  ) { }

  ngOnInit(): void {

    // global header
    this.globalService.selectedItem = 'simulated-exam';
    this.globalService.selectedModule = {} as ExamModule;
    this.questionAttempts = (this.route.snapshot.data['allQuestions'] as AssessmentAttemptsResponse).items;

    this.attempt = this.enrollmentService.getSelectedSimulatedExamAttempt();
    this.sessionStartTime = Date.now();

    // has this attempt already been completed?
    if (this.attempt.completed !== null) {
      // leave and go to the feedback page
      this.router.navigate(['simulated-exam', 'results']);

      return;
    }

    // question directive objects
    this.progress = {};
    this.question = {};
    this.glossaryTerms = [];
    this.directiveConfig = {
      showFeedback: false,
      showAnswer: false,
      showBookmark: true
    };

    this.exam = this.enrollmentService.getExam();
    this.questionIndex = -1;

    // track if we are in a save process
    this.saving = false;

    // log
    if (this.attempt.totalTime === null) {
      // LogService.activity('new simulated exam attempt');
    } else {
      // LogService.activity('resume simulated exam attempt');
    }
    this.init();
  }

  init() {
    // remove loading bar
    this.globalService.hideLoader();

    this.questionAttempts = (this.route.snapshot.data['allQuestions'] as AssessmentAttemptsResponse).items;

    // clean up data
    this.questionAttempts = this.simulatedExamService.sanitizeQuestions(this.questionAttempts);

    // make sure they are ordered correctly
    this.questionAttempts = this.orderBy.transform(this.questionAttempts, 'sort', false);

    // update question directive objects
    this.progress = {
      totalQuestions: this.questionAttempts.length,
      correct: 0,
      incorrect: 0
    };

    // check for progress and forward the index
    for (let x = 0; x < this.questionAttempts.length; x++) {
      // todo: 4200 check answered is not available in AssessmentAttempt interface.. i am adding for timebeing
      if (!this.questionAttempts[x].answered) {
        this.next(true);

        break;
      }

      this.questionIndex++;
    }
  }

  check(index: number) {
    // store user selection
    this.questionAttempt.answer = this.questionAttempt.question.answers[index].id;

    if (this.questionAttempt.question.answers[index].correct) {
      this.markCorrect();
    } else {
      this.markIncorrect();
    }

    // now save it
    this.simulatedExamService.updateQuestion(this.questionAttempts[this.questionIndex]);
  }

  next(resuming?: boolean) {

    // are we done?
    const isDone = (this.questionIndex + 1) == this.attempt.questionCount;

    // any more questions?
    if (isDone) {
      return this.done();
    }

    this.questionIndex++;
    this.questionAttempt = this.questionAttempts[this.questionIndex];

    // has this next question already been answered?
    if (this.questionAttempt.answered === true) {
      this.next(true);
    }

    this.globalService.shuffleArray(this.questionAttempt.question.answers);


    this.question = this.questionAttempt.question;
    this.question.bookmarked = this.questionAttempt.bookmarked;
    this.question.number = this.questionIndex + 1;
  }

  bookmark() {
    this.questionAttempt.bookmarked = !this.questionAttempt.bookmarked;
  }

  markCorrect() {
    this.questionAttempt.correct = true;
    this.questionAttempt.incorrect = false;
    this.questionAttempt.answered = true;
    this.questionAttempt.viewed = true;
  }

  markIncorrect() {
    this.questionAttempt.incorrect = true;
    this.questionAttempt.correct = false;
    this.questionAttempt.answered = true;
    this.questionAttempt.viewed = true;
  }

  done() {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage('Saving...');

    // stop timer without broadcasting event
    this.countdown.stop();

    // reset attempt progress
    this.attempt.correct = 0;
    this.attempt.incorrect = 0;
    this.attempt.bookmarked = 0;

    // update attempt
    this.questionAttempts.forEach((questionAttempt: any) => {
      if (questionAttempt !== undefined) {
        if (questionAttempt.correct === true) {
          this.attempt.correct++;
        } else {
          this.attempt.incorrect++;
        }

        if (questionAttempt.bookmarked) {
          this.attempt.bookmarked++;
        }
      }
    });

    // save attempt
    this.attempt.score = Math.round(this.attempt.correct / this.attempt.questionCount * 100);
    this.attempt.completed = Date.now() / 1000;

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    // save data before we move forward
    this.assessmentAttemptService.update(this.attempt, this.attempt.id).subscribe((collection: any) => {
      this.enrollmentService.setSelectedSimulatedExamAttempt(collection);

      // store question attempts for feedback page
      this.enrollmentService.setQuestionAttempts(this.questionAttempts);
      this.router.navigate(['simulated-exam', 'results']);
    });

  }

  // do we need to do anything here?
  save(path?: string) {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage('Saving...');

    // stop timer without broadcasting event
    this.countdown.stop();

    // add time in seconds
    this.attempt.totalTime += (Date.now() - this.sessionStartTime) / 1000;

    // save attempt
    this.assessmentAttemptService.update(this.attempt, this.attempt.id).subscribe((collection: any) => {
      this.enrollmentService.setSelectedSimulatedExamAttempt(collection);
      // was a path set?
      path = typeof path !== 'undefined' ? path : '/dashboard';
      this.router.navigate([path]);
    });

  }

  handletTimerEvent(event: any): void {
    // handle when the timer is up
    if (event.action === 'done') {
      this.done();
      window.alert("Time is up!");
    }
  }

  ngOnDestroy() {
    // clean up tasks
    // stop timer without broadcasting event
    this.countdown.stop();
  }

}
