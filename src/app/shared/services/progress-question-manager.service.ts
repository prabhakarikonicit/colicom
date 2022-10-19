import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressQuestionManagerService {

progressQuestions = [];
  constructor(private globalService:GlobalService) { }
  setProgressQuestions(collection: any) {
    this.progressQuestions = collection;
  }
  getProgressQuestions() {
    return this.progressQuestions;
  }

  getBookmarked() {
    return this.globalService.filterKeyVal(this.progressQuestions, { bookmarked: true });
  }
  getCorrect() {
    return this.globalService.filterKeyVal(this.progressQuestions, { correct: true });
  }
  getIncorrect() {
    return this.globalService.filterKeyVal(this.progressQuestions, { answered: true, correct: false });
  }
  getAnswered() {
    return this.globalService.filterKeyVal(this.progressQuestions, { answered: true });
  }
  getNotAnswered() {
    return this.globalService.filterKeyVal(this.progressQuestions, { answered: false });
  }
  getViewed() {
    return this.globalService.filterKeyVal(this.progressQuestions, { viewed: '' });
  }
  getNotViewed() {
    return this.progressQuestions.filter((value: any) => (typeof value.viewed !== 'undefined' && parseInt(value.viewed) === 0));
  }

  getTotal() {
    return this.progressQuestions.length;
  }
  getTotalBookmarked() {
    return this.getBookmarked().length;
  }
  getTotalCorrect() {
    return this.getCorrect().length;
  }
  getTotalIncorrect() {
    return this.getIncorrect().length;
  }
  getTotalAnswered() {
    return this.getAnswered().length;
  }
  getTotalViewed() {
    return this.getViewed().length;
  }
  getTotalNotViewed() {
    return this.getNotViewed().length;
  }

  getScore() {
    return Math.round(this.getTotalCorrect() / this.getTotal() * 100)
  }
}