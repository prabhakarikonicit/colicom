import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements OnInit {

  @Input() progressQuestion: any = {};
  @Input() questionIndex: any = {};
  @Input() totalQuestions: any = {};
  @Input() attempt: any = {};
  @Input() isBookmarked: any = {};
  @Input() questionAttempt: any = {};
  @Input() flip: any = {};


  @Output() onMarkCorrect: EventEmitter<boolean> = new EventEmitter();
  @Output() onMarkIncorrect: EventEmitter<string> = new EventEmitter();
  @Output() onBookmark: EventEmitter<boolean> = new EventEmitter();
  @Output() onNext: EventEmitter<boolean> = new EventEmitter();
  @Output() onSave: EventEmitter<string> = new EventEmitter();

  showTermFirst: boolean = false;
  processing: boolean = false;
  audio: any;

  constructor() { }

  ngOnInit(): void {

    // defaults
    this.showTermFirst = false;
    this.processing = false; // need to prevent multiple clicks on buttons
    this.audio = {
      loading: false
    };

    // create audio html5 component
    this.audio = document.createElement('audio');

    // track when start playing
    this.audio.addEventListener('loadeddata', () => {
      this.audio.loading = false;
      // this.$apply();
    }, false);

  }

  playSound() {
    let file;

    if (this.showTermFirst !== false) {
      file = this.progressQuestion.question.audioFile;
    } else {
      file = this.progressQuestion.question.answers[0].audioFile;
    }

    // path is /<first char>/<first 2 chars>/file.ext
    let src = environment.AUDIO_URL + file.substr(0, 1) + '/' + file.substr(0, 2) + '/' + file;

    // show loading
    this.audio.loading = true;

    this.audio.src = src;
    this.audio.play();
  }

  /**
   * reset vars and go next
   */
  answered(correct: boolean) {
    this.processing = true;
    if (correct) {
      this.onMarkCorrect.emit();
    } else {
      this.onMarkIncorrect.emit();
    }
    this.onNext.emit();
  }

  flipCard() {
    this.flip.active = true;
    this.processing = false;
  }

  hasAudio() {
    if (this.progressQuestion.question !== undefined &&
      this.showTermFirst &&
      this.progressQuestion.question.audioFile !== null) {
      return true;
    } else if (
      this.progressQuestion.question !== undefined && !this.showTermFirst &&
      this.progressQuestion.question.answers[0].audioFile !== null) {
      return true;
    }
    return false;
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

}
