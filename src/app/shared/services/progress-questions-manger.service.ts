import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressQuestionsMangerService {
  progressQuestions: any = [];

  constructor() { }

  setProgressQuestions(collection: any) {
    this.progressQuestions = collection;
  }

  getProgressQuestions() {
    return this.progressQuestions;
  }

  getBookmarked() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.bookmarked === true);
  }

  getCorrect() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.correct === true);
  }

  getIncorrect() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.answered === true && progressQuestion.correct === false);
  }

  getAnswered() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.answered === true);
  }

  getNotAnswered() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.answered === false);
  }

  getViewed() {
    return this.progressQuestions.filter((progressQuestion: any) => progressQuestion.viewed === '');
  }

  getNotViewed() {
    return this.progressQuestions.filter((progressQuestion: any) => typeof progressQuestion.viewed !== 'undefined' && parseInt(progressQuestion.viewed) === 0);
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
    return Math.round(this.getTotalCorrect() / this.getTotal() * 100);
  }

}
