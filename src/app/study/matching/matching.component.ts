import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { StudyService } from 'src/app/shared/services/study.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {

  @Input() progressQuestion: any = {};
  @Input() questionIndex: any = {};
  @Input() totalQuestions: any = {};
  @Input() attempt: any = {};
  @Input() questionAttempt: any = {};
  @Input() questionAttempts: any = {};
  @Input() matches: any = {};
  @Input() matchingAnswers: any = {};
  @Input() matchingColors: any = {};



  @Output() onMarkCorrect: EventEmitter<boolean> = new EventEmitter();
  @Output() onMarkIncorrect: EventEmitter<string> = new EventEmitter();
  @Output() onNext: EventEmitter<boolean> = new EventEmitter();
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onNextSet: EventEmitter<number> = new EventEmitter();

  answered = false;
  graded = false;
  item0: any = {};
  item1: any = {};
  item2: any = {};
  item3: any = {};

  mobileMatching: any = {};
  answer0: any = {};
  answer1: any = {};
  answer2: any = {};
  answer3: any = {};

  constructor(private globalService: GlobalService, private studyService: StudyService, private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.answered = false;
    this.graded = false;
    this.item0 = {};
    this.item1 = {};
    this.item2 = {};
    this.item3 = {};

    this.mobileMatching = {};
    this.answer0 = {};
    this.answer1 = {};
    this.answer2 = {};
    this.answer3 = {};

    // using this to check if orientation in mobile is changed
    let initialPageWidth = window.innerWidth;
    let initialPageHeight = window.innerHeight;

    // for mobile only, reset on orientation change
    if (this.deviceService.isMobile() === true) {
      window.addEventListener('resize', () => {
        // did orientation change?
        if (window.innerWidth !== initialPageHeight) {
          return;
        }

        // update
        const tmp = initialPageHeight;
        initialPageHeight = initialPageWidth;
        initialPageWidth = tmp;

        // need full reset to wipe out answers if landscape
        if (window.innerWidth > window.innerHeight) {
          this.reset(true);
        } else {
          this.reset(false);
        }

        // this.$apply(); // todo 4200
      }, false);
    }

    this.reset(true);
  }

  getItem(index: number) {
    return (this as any)['item' + index];
  }

  getAnswer(index: number) {
    return (this as any)['answer' + index];
  }

  setItemId(index: number, questionAttemptId: number) {
    (this as any)['item' + index].id = questionAttemptId;
  }

  onDrop(index: number, id: number, event: any) {

    const data = event.dragData.data;
    const color = event.dragData.color;
    const item = this.getItem(index);

    // do we need to clean up first?
    if (item.element !== undefined) {
      this.unSelect(index);
    }

    item.id = id;
    item.color = color;
    item.word = this.getProgressQuestionForQuestionId(data.questionId).question.questionText;
    item.answered = true;
    item.correct = (id == data.id) ? true : false;
    item.element = event.nativeEvent.target;
    item.selected = true;
    item.matcheId = data.id;

    // event.nativeEvent.target.addClass('selected');
    this.checkIfDone();
  };

  unSelect(index: number) {
    const item = this.getItem(index);

    // anything selected?
    if (item.element === null) {
      return;
    }

    // update left side element before restoring defaults
    // item.element.removeClass('selected');
    item.selected = false;
    item.matcheId = null;

    // don't remove the id as it removed it from the question progress
    // it seems which breaks when using portrait mode
    item.id = null;
    item.color = null;
    item.word = null;
    item.answered = false;
    item.correct = false;
    item.element = null;

    this.answered = false;
  };

  getProgressQuestionForQuestionId(id: number) {
    return this.studyService.getProgressQuestions().filter(getProgressQuestion => getProgressQuestion.questionId === id)[0];
  };

  getWordFor(index: number) {
    const item = this.getItem(index);

    if (item === undefined || item.word === null) {
      return;
    }

    return item.word;
  };

  checkIfDone() {
    for (let x = 0; x < this.matches.length; x++) {
      if (this.getItem(x).answered !== true) {
        return;
      }
    }

    this.answered = true;
  };

  nextSet() {
    // update question index
    this.onNextSet.emit(this.matches.length - 1);

    // done, lets move on - true so it doesn't save again
    this.onNext.emit(true);

    // reset all
    this.reset(true);
  };

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
  };

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

  checkAnswers() {
    let item: any;

    for (let x = 0; x < this.matches.length; x++) {
      item = this.getItem(x);
      this.questionAttempt = this.questionAttempts.filter((questionAttempt: any) => questionAttempt.id === item.id)[0];

      this.questionAttempt.answered = true;
      this.questionAttempt.view = 'matching';
      this.questionAttempt.viewed++;

      // get progress question
      this.progressQuestion = this.studyService.getProgressQuestions().filter((getProgressQuestion: any) => getProgressQuestion.questionId === this.questionAttempt.questionId)[0];

      // update progress
      this.questionAttempt.answer = item.word.toString();
      if (item.correct) {
        this.markCorrect();
      } else {
        this.markIncorrect();
      }

      // update more progress question stuff
      this.progressQuestion.viewed++;
      this.progressQuestion.answered = true;
      this.progressQuestion.bookmarked = this.questionAttempt.bookmarked;

      // add  progressQuestion to questionAttempt in a copy, leave original alone
      this.questionAttempt.progressQuestion = JSON.parse(JSON.stringify(this.progressQuestion));
      delete this.questionAttempt.progressQuestion.progress;
      delete this.questionAttempt.progressQuestion.question;

      // add to queue
      this.studyService.addToModuleAttemptQuestionUpdateQueue(this.questionAttempt);
    }

    // save
    const result = this.studyService.bulkUpdateQueuedModuleAttemptQuestionsWithProgress();

    if (!!result) {
      result.subscribe();
    }

    // done here
    this.graded = true;
  };

  // mobile code
  mobileQuestionSelected(questionIndex: number, questionAttempt: any) {
    this.mobileMatching.showAnswers = true;
    this.mobileMatching.selectedQuestionIndex = questionIndex;
    this.mobileMatching.selectedQuestionId = questionAttempt.id;
  };

  mobileAnswerSelected(answerIndex: number, questionAttempt: any) {
    const answer = this.getAnswer(answerIndex);

    // already selected?
    if (answer.selected) {
      return;
    }

    // hide menu
    this.mobileMatching.showAnswers = false;

    // update
    answer.selected = true;

    // update question
    const question = this.getItem(this.mobileMatching.selectedQuestionIndex);

    // was an answer already selected?
    if (question.selectedAnswerIndex !== null && question.selectedAnswerIndex !== undefined) {
      // reset answer as well
      const answerOld = this.getAnswer(question.selectedAnswerIndex);
      answerOld.selected = false;
    }

    question.color = answer.color;
    question.word = this.getProgressQuestionForQuestionId(questionAttempt.questionId).question.questionText;
    question.answered = true;
    question.correct = (questionAttempt.id == this.mobileMatching.selectedQuestionId) ? true : false;
    question.selectedAnswerIndex = answerIndex;

    // we done?
    this.checkIfDone();
  };

  mobileAnswerUnSelect(questionIndex: number) {
    // get question
    const question: any = this.getItem(questionIndex);

    question.color = null;
    question.word = null;
    question.answered = false;
    question.correct = false;

    // not answered
    this.answered = false;

    // reset answer as well
    const answer: any = this.getAnswer(question.selectedAnswerIndex);
    answer.selected = false;

    question.selectedAnswerIndex = null;
  };

  reset(full: boolean) {
    this.answered = false;
    this.graded = false;

    // remove selected
    if (this.item0.element !== undefined && this.item0.element !== null) {
      // this.item0.element.removeClass('selected');
      this.item0.color = null;
      this.item0.word = null;
      this.item0.selected = null;
      this.item0.matcheId = null;
    }
    if (this.item1.element !== undefined && this.item1.element !== null) {
      // this.item1.element.removeClass('selected');
      this.item1.color = null;
      this.item1.word = null;
      this.item1.selected = null;
      this.item1.matcheId = null;
    }
    if (this.item2.element !== undefined && this.item2.element !== null) {
      // this.item2.element.removeClass('selected');
      this.item2.color = null;
      this.item2.word = null;
      this.item2.selected = null;
      this.item2.matcheId = null;
    }
    if (this.item3.element !== undefined && this.item3.element !== null) {
      // this.item3.element.removeClass('selected');
      this.item3.color = null;
      this.item3.word = null;
      this.item3.selected = null;
      this.item3.matcheId = null;
    }

    // to reset everything including ids
    if (full) {
      this.item0 = {
        id: null,
        color: null,
        word: null,
        answered: false,
        correct: false,
        element: null,
        selected: null,
        matcheId: null
      };
      this.item1 = {
        id: null,
        color: null,
        word: null,
        answered: false,
        correct: false,
        element: null,
        selected: null,
        matcheId: null
      };
      this.item2 = {
        id: null,
        color: null,
        word: null,
        answered: false,
        correct: false,
        element: null,
        selected: null,
        matcheId: null
      };
      this.item3 = {
        id: null,
        color: null,
        word: null,
        answered: false,
        correct: false,
        element: null,
        selected: null,
        matcheId: null
      };
    }

    // mobile
    this.mobileMatching = {
      showAnswers: false,
      selectedQuestionIndex: null,
      selectedQuestionId: null
    };

    this.answer0 = {
      id: null,
      color: 'green',
      selected: false
    };
    this.answer1 = {
      id: null,
      color: 'yellow',
      selected: false
    };
    this.answer2 = {
      id: null,
      color: 'blue',
      selected: false
    };
    this.answer3 = {
      id: null,
      color: 'red',
      selected: false
    };

  }

  save() {
    this.onSave.emit();
  }

  isSelectedMatch(id: number) {
    return this.item0.matcheId === id || this.item1.matcheId === id || this.item2.matcheId === id || this.item3.matcheId === id;
  }

}
