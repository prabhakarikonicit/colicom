import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamModule } from 'src/app/shared/interfaces/interfaces';
import { OrderByPipe } from 'src/app/shared/pipe/order-by.pipe';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModuleAttemptService } from 'src/app/shared/services/module-attempt.service';
import { StudyService } from 'src/app/shared/services/study.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-study-attempt',
  templateUrl: './study-attempt.component.html',
  styleUrls: ['./study-attempt.component.scss']
})
export class StudyAttemptComponent implements OnInit {

  moduleAttemptQuestionResponse: any;
  attempt: any;
  progressQuestion: any;
  progressQuestions: any;
  flip: any;
  matches: any;
  matchingAnswers: any;
  matchingColors: any;
  questionAttempts: any;
  questionAttempt: any;

  viewType: string = '';
  queuedQuestions: number = 0;
  questionIndex: number = 0;
  totalQuestions: number = 0;
  sessionStartTime: number = 0;
  inputAnswer: any = [];
  questionAnswered: boolean = false;
  answeredCorrect: boolean = false;
  saving: boolean = false;

  examModule: ExamModule = {} as ExamModule;

  constructor(private globalService: GlobalService, private enrollmentService: EnrollmentService, private studyService: StudyService, private router: Router, private route: ActivatedRoute, private orderByPipe: OrderByPipe, private moduleAttemptService: ModuleAttemptService) { }

  ngOnInit(): void {

    this.moduleAttemptQuestionResponse = this.route.snapshot.data['moduleAttemptQuestionResponse'];

    // global header
    this.globalService.selectedItem = 'study';
    this.globalService.selectedModule = this.enrollmentService.getSelectedExamModule();

    this.attempt = this.studyService.getAttempt();
    this.sessionStartTime = Date.now();

    // has this attempt already been completed?
    if (this.attempt.completed !== null) {
      // leave and go to the feedback page
      this.router.navigate(['study', 'results']);
      return;
    }

    // remove loading
    this.globalService.hideLoader();

    this.questionIndex = -1;
    this.totalQuestions = this.attempt.questionCount;
    this.inputAnswer = [];
    this.questionAnswered = false;
    this.examModule = this.enrollmentService.getSelectedExamModule();

    // track if we are in a save process
    this.saving = false;

    // log
    if (this.moduleAttemptQuestionResponse[0].answered === false) {
      // LogService.activity('new study attempt');
    } else {
      // LogService.activity('resume study attempt');
    }

    // track question progresses
    this.progressQuestions = this.studyService.getProgressQuestions();
    this.progressQuestion = {};

    // track queue vars
    this.queuedQuestions = 0;

    // for flash cards
    this.flip = {
      active: false
    };

    // for matching
    this.matches = [];
    this.matchingAnswers = [];
    this.matchingColors = ['green', 'yellow', 'blue', 'red'];

    // which type do we want?
    if (this.route.snapshot.params['mode'] === undefined) {
      this.viewType = 'flashcard';
    } else {
      this.viewType = this.route.snapshot.params['mode'];
    }

    // watch for navigation shenanigans - if they leave save unless already saving/saved
    // var onRouteChangeOff = this.$on('$locationChangeStart', routeChange);

    // order attempts by sort
    this.questionAttempts = this.orderByPipe.transform(this.moduleAttemptQuestionResponse, 'sort', false)
    this.enrollmentService.setQuestionAttempts(this.questionAttempts);

    // rest vars
    this.attempt.correct = 0;
    this.attempt.incorrect = 0;

    // check for progress and forward the index
    for (var x = 0; x < this.questionAttempts.length; x++) {
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

    // save anything in queue
    if (this.queuedQuestions > 0) {
      const result = this.studyService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();
      if (result) {
        result.subscribe(_ => {
          this.queuedQuestions = 0;
        });
      }
    }

    this.next();

  }


  next(resuming?: boolean) {
    // reset stuff
    var delay = 0;
    this.inputAnswer = [];
    this.questionAnswered = false;

    var questionAttempt = this.questionAttempts[this.questionIndex];

    // are we done?
    var isDone = (this.questionIndex + 1) == this.questionAttempts.length;

    if (this.questionIndex > -1 && !resuming) {
      this.questionAttempts[this.questionIndex].view = this.viewType;

      // save question
      this.progressQuestion.viewed++;
      this.progressQuestion.answered = true;
      //this.progressQuestion.correct = questionAttempt.correct;
      this.progressQuestion.bookmarked = questionAttempt.bookmarked;

      // add  progressQuestion to questionAttempt in a copy, leave original alone
      var tempProgressQuestion = JSON.parse(JSON.stringify(this.progressQuestion));
      delete tempProgressQuestion.progress;
      delete tempProgressQuestion.question;
      questionAttempt.progressQuestion = tempProgressQuestion;

      // add to queue
      this.studyService.addToModuleAttemptQuestionUpdateQueue(questionAttempt);
      this.queuedQuestions++;

      // add to queue
      if (this.queuedQuestions === environment.SAVE_EVERY_QUESTIONS && !isDone) {
        const result = this.studyService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();
        if (result) {
          result.subscribe(_ => {
            this.queuedQuestions = 0;
          });
        }
      }
    }

    // any more questions?
    if (isDone) {
      // show loading
      this.globalService.setLoaderMessage("Saving...");
      this.queuedQuestions = 0;
      const response: any = this.studyService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();

      if (response === false) {
        return this.done();
      } else {
        // else wait until it's done
        response.subscribe((_: any) => {
          this.done();
        });
      }

      return;
    }

    // small delay to avoid flicker for flashcard
    if (this.viewType == 'flashcard') {
      delay = 400;
    }

    setTimeout(() => {
      // reset for flashcard
      this.flip.active = false;

      this.questionIndex++;
      this.questionAttempt = this.questionAttempts[this.questionIndex];
      this.questionAttempts[this.questionIndex].viewed = true;

      // if here, move to next index - find progress question
      this.progressQuestion = this.studyService.getProgressQuestions().filter((getProgressQuestion: any) => getProgressQuestion.questionId === this.questionAttempt.questionId)[0];

      this.questionAttempt.bookmarked = this.progressQuestion.bookmarked;

      // if matching we need to setup
      if (this.viewType == 'matching') {
        this.setupMatching();
      }
    }, delay);

  }

  /**
   * can't always access this property in nested controllers
   * @param index
   */
  setQuestionIndex(index: number) {
    this.questionIndex = index;
  }

  getQuestionIndex() {
    return this.questionIndex;
  }

  bookmark() {
    if (this.questionAttempt.bookmarked) {
      this.questionAttempt.bookmarked = false;
      this.studyService.getProgress().bookmarked--;
    } else {
      this.questionAttempt.bookmarked = true;
      this.studyService.getProgress().bookmarked++;
    }
  }

  isBookmarked() {
    if (this.questionAttempt !== undefined) {
      return this.questionAttempt.bookmarked;
    }
  }

  markCorrect() {
    this.attempt.correct++;
    this.questionAttempt.correct = true;
    this.questionAttempt.incorrect = false;
    this.questionAttempt.answered = true;

    // update progress
    if (this.progressQuestion.correct) {
      return;
    } else if (this.progressQuestion.correct === false && this.progressQuestion.answered === true) {
      this.studyService.getProgress().incorrect--;
    }

    this.progressQuestion.correct = true;
    this.studyService.getProgress().correct++;
  }

  markIncorrect() {
    this.attempt.incorrect++;
    this.questionAttempt.incorrect = true;
    this.questionAttempt.correct = false;
    this.questionAttempt.answered = true;

    // update progress
    if (this.progressQuestion.correct === false && this.progressQuestion.answered) {
      return;
    } else if (this.progressQuestion.correct) {
      this.studyService.getProgress().correct--;
    }

    this.progressQuestion.correct = false;
    this.studyService.getProgress().incorrect++;
  };

  done() {
    // in save state
    this.saving = true;

    // update attempt
    this.questionAttempts.forEach((questionAttempt: any) => {
      if (questionAttempt.bookmarked) {
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
    this.moduleAttemptService.update(this.attempt.moduleId, this.attempt).subscribe(collection => {
      this.studyService.setAttempt(collection);
      this.router.navigate(['study', 'results']);
    })

  }

  // fitb specific if override, mark wrong
  showAnswer(override: any) {
    var answer = [];
    var correct = true;
    var userAnswer = '';

    if (override === false) {
      correct = false;
    }

    var trustedHtml = this.globalService.trustAsHtml(this.progressQuestion.question.questionText) as string;
    var words = trustedHtml.split(" ");
    for (var x = 0; x < words.length; x++) {
      var chars = words[x].split("");
      var values = [];

      for (var y = 0; y < chars.length; y++) {
        var answeredValue = (this.inputAnswer[x] !== undefined && this.inputAnswer[x][y] !== undefined) ? this.inputAnswer[x][y].toLowerCase() : false;
        userAnswer += answeredValue;

        if (answeredValue !== chars[y].toLowerCase()) {
          correct = false;
        }

        values.push(chars[y]);
      }
      answer.push(values);
      userAnswer += ' ';
    }

    // remove last space from user answer
    userAnswer = userAnswer.trim();

    this.inputAnswer = answer;
    this.questionAnswered = true;
    this.answeredCorrect = correct;

    // store user answer
    this.questionAttempt.answer = userAnswer;

    if (correct) {
      this.markCorrect();
    } else {
      this.markIncorrect();
    }
  }

  // matching specific
  setupMatching() {
    this.matches = [];
    this.matchingAnswers = [];
    for (var x = this.questionIndex; x < this.questionAttempts.length; x++) {
      this.matches.push(this.questionAttempts[x]);
      this.matchingAnswers.push(this.questionAttempts[x]);

      this.globalService.shuffleArray(this.matchingAnswers);
      this.globalService.shuffleArray(this.matches);

      // can only have up to 4
      if (this.matches.length == 4) {
        break;
      }
    }
  }

  // do we need to do anything here?
  save(path: string) {
    // in save state
    this.saving = true;

    // show loading
    this.globalService.setLoaderMessage("Saving...");

    // save anything in queue
    var result = this.studyService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();

    // was a path set?
    path = typeof path !== 'undefined' ? path : 'dashboard';

    // promise or false?
    if (result === false) {
      this.router.navigate([path]);
    } else {
      result.subscribe(_ => {
        this.router.navigate([path]);
      });
    }
  }

  // routeChange(event, newLocation, oldLocation) {
  //   if (this.saving) {
  //     return;
  //   }

  //   // stop listening to route changes
  //   // onRouteChangeOff();

  //   // clean up path
  //   if (newLocation.indexOf('#')) {
  //     newLocation = newLocation.substring(newLocation.indexOf('#') + 1);
  //   }

  //   this.save(newLocation);

  //   // done
  //   return;
  // };


  // needed to interact with the jquery dropdown
  changeView() {
    // for matching we need to setup
    if (this.viewType == 'matching') {
      this.setupMatching();
    }
  }

  nextSet(matchesLength: number) {
    // update question index
    this.setQuestionIndex(this.getQuestionIndex() + matchesLength);
  }

}


