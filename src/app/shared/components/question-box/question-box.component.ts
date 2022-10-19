import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { GlossaryTermsPipe } from '../../pipe/glossary-terms.pipe';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-question-box',
  templateUrl: './question-box.component.html',
  styleUrls: ['./question-box.component.scss'],
})
export class QuestionBoxComponent implements OnChanges {

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    this.updateAnswer(event)
  }
  @Input() progress:any;
  @Input() question:any;
  @Input() terms:any;
  @Input() config:any;
  @Output() callbackCheck = new EventEmitter();
  @Output() callbackNext = new EventEmitter();
  @Output() callbackBookmark = new EventEmitter();

  questionAnswered:boolean = false;
  answeredIndex:any = null;
  buttonLabel:any = null;
  trustedQuestionText:any;

  constructor(private glossaryTermsPipe: GlossaryTermsPipe, private globalService:GlobalService) { }

  ngOnChanges(changes: SimpleChanges): void {
     /*** determine if the question has been answered
     * @type {boolean} */
      this.questionAnswered = false;

      /**
       * track which answer was clicked on as the correct answer
       * @type {null}
       */
      this.answeredIndex = null;
 
      /**
       * label to show in the UI
        * @type {null}
       */
      this.buttonLabel = null;
 
      /**
       * When an answer is selected, the check button appears and calls this
       * @param answerIndex
       */
 
       // default terms to array
       if (!this.terms) {
           this.terms = [];
       }
 
      //  console.log("Checking Question details ", this.question, this.terms);
 
       // get trusted text
       this.trustedQuestionText = this.glossaryTermsPipe.transform(this.question.questionText, this.terms);
 
       this.buttonLabel = this.config.showAnswer ? 'Check Answer' : 'Next Question';

       this.globalService.hideLoader();
  }

  checkQuestion(answerIndex:any) {
    if (!this.questionAnswered) {
      this.questionAnswered = true;
      this.callbackCheck.emit(answerIndex);
    }

    // go ahead and call next to move on
    if (!this.config.showAnswer) {
      this.nextQuestion();
    }
  }

  nextQuestion() {
    this.callbackNext.emit();
  }

  bookmark() {
    this.question.bookmarked = !this.question.bookmarked;
    this.callbackBookmark.emit();
  }

  changeAnswer(index:any) {
    
    if (this.questionAnswered) {
      return;
    }

    if (this.question.answers.length <= index) {
       return;
    }

    this.answeredIndex = index;

  }

  updateAnswer(event: KeyboardEvent) {

    switch (event && event.keyCode) {
      case 13: // enter
        if (!this.questionAnswered && this.answeredIndex !== null) {
          this.checkQuestion(this.answeredIndex);
        } else if (this.questionAnswered) {
          this.nextQuestion();
        }
        break;
      case 49: // 1
      case 65: // A
      case 97: // a
        this.changeAnswer(0);
        break;
      case 50: // 2
      case 66: // b
      case 98: // b
        this.changeAnswer(1);
        break;
      case 51: // 3
      case 67: // c
      case 99: // c
        this.changeAnswer(2);
        break;
      case 52: // 4
      case 68: // d
      case 100: // d
        this.changeAnswer(3);
        break;
      case 53: // 5
      case 69: // e
      case 101: // e
        this.changeAnswer(4);
        break;
      case 54: // 6
      case 70: // f
      case 102: // f
        this.changeAnswer(5);
        break;
      case 55: // 7
      case 71: // g
      case 103: // g
        this.changeAnswer(6);
        break;
    }

  }
  
}
