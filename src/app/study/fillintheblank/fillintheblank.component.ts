import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-fillintheblank',
  templateUrl: './fillintheblank.component.html',
  styleUrls: ['./fillintheblank.component.scss']
})
export class FillintheblankComponent implements OnInit, OnChanges {

  @Input() progressQuestion: any;
  @Input() inputAnswer: any = [];
  @Input() questionIndex: any;
  @Input() totalQuestions: any;
  @Input() attempt: any;
  @Input() answeredCorrect: any;
  @Input() questionAnswered: any;
  @Input() isBookmarked: any;

  @Output() onShowAnswer: EventEmitter<boolean> = new EventEmitter();
  @Output() onNext: EventEmitter<boolean> = new EventEmitter();
  @Output() onBookmark: EventEmitter<boolean> = new EventEmitter();
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  
  retypeAnswer: any;
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showHint(true);
  }

  // for fitb to show part of the answer
  showHint(initialLoad?: boolean) {
    // randomly pick 40% of the letters to show
    const probability = 40;
    const trustedHtml = this.globalService.trustAsHtml(this.progressQuestion.question.questionText);
    const words = trustedHtml.split(" ");

    // should always show at least one more if not all filled
    let newChars = 0;
    let filledInChars = 0;

    // don't have internet to check how to replace all so...
    let totalChars: string | number = trustedHtml;

    do {
      totalChars = totalChars.replace(' ', '');
    } while (totalChars.indexOf(' ') != -1);

    totalChars = totalChars.length;

    for (let x = 0; x < words.length; x++) {
      // update array only if it's not already set to not delete a users answer
      if (this.inputAnswer[x] === undefined) {
        this.inputAnswer[x] = [];
      }

      const chars = words[x].split("");

      for (let y = 0; y < chars.length; y++) {
        // if already filled ignore
        if (this.inputAnswer[x][y] !== undefined && this.inputAnswer[x][y] !== null) {
          filledInChars++;
          continue;
        }

        const random = Math.random() * 100;
        // show answer if random is in the 40%
        if (random > probability) {
          continue;
        }
        this.inputAnswer[x][y] = initialLoad? null : chars[y];
        newChars++;
      }
    }

    if ((filledInChars + newChars) == totalChars) {
      // mark incorrect and done
      return this.showAnswer(false);
    }

    // if we are here it's because there are still empty boxes and due to the random
    // above, we didn't show any new characters to lets loop again
    if (newChars === 0) {
      this.showHint();
    }
  }

  checkAnswer(value: any) {
    if (value === undefined) {
      return false;
    }

    return this.globalService.trustAsHtml(this.progressQuestion.question.questionText).toLowerCase() === value.toLowerCase();
  }

  /**
   * We should only allow the user to input alphanumeric characters. Show others by default
   * @param char
   * @param parentIndex
   * @param index
   * @returns {boolean}
   */
  shouldShowChar(char: string, parentIndex: number, index: number) {
    const expression = /[0-9a-zA-Z]/;

    if (char.match(expression)) {
      return false;
    } else {
      if (this.inputAnswer[parentIndex] === undefined) {
        this.inputAnswer[parentIndex] = [];
      }

      // set default value
      this.inputAnswer[parentIndex][index] = char;

      return true;
    }
  }

  save() {
    this.onSave.emit();
  }

  bookmark() {
    this.onBookmark.emit();
  }

  next() {
    this.onNext.emit();
  }

  showAnswer(override?: boolean) {
    this.onShowAnswer.emit(override);
  }

}
