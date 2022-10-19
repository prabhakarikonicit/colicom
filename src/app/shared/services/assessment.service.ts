import { Injectable } from '@angular/core';
import { AssessmentAttemptQuestionService } from './assessment-attempt-question.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  queuedAssessmentAttemptQuestions: any = [];
  constructor(private globalService: GlobalService, private assessmentAttemptQuestionService: AssessmentAttemptQuestionService) { }

  sanitizeQuestions(questions: any) {
    // sanitize all html
    questions.forEach((question: any) => {
      question.question.questionText = this.globalService.trustAsHtml(question.question.questionText);
      // and answers
      question.question.answers.forEach((answer: any) => {
        answer.answerText = this.globalService.trustAsHtml(answer.answerText);
      });
    });

    return questions;
  }

  // module attempt questions methods
  addToAssessmentAttemptQuestionUpdateQueue(assessmentAttemptQuestion: any) {
    const questionCopy = JSON.parse(JSON.stringify(assessmentAttemptQuestion));

    // remove the question object since we don't need it and it causing issues with cloudflare
    // sometimes - COMP-910
    questionCopy.question = null;

    this.queuedAssessmentAttemptQuestions.push(questionCopy);
  }

  // module attempt questions methods
  clearAssessmentAttemptQuestionUpdateQueue() {
    this.queuedAssessmentAttemptQuestions = [];
  }

  bulkUpdateQueuedAssessmentAttemptQuestions() {
    // check if we have anything in the queue
    if (this.queuedAssessmentAttemptQuestions[0] == undefined) {
      return;
    }

    // get the module id from the first question attempt
    const id = this.queuedAssessmentAttemptQuestions[0].assessmentAttemptId;

    // is the id valid?
    // if (!angular.isNumber(id)) {
    //   _LTracker.push({
    //     'text': 'bulkUpdateQueuedAssessmentAttemptQuestions id NaN',
    //     'error': id
    //   });
    // }

    // are any questions we are about to save empty?
    for (let i = 0, len = this.queuedAssessmentAttemptQuestions.length; i < len; i++) {
      if (this.queuedAssessmentAttemptQuestions[i].answered !== true) {
        // _LTracker.push({
        //   'text': 'bulkUpdateQueuedAssessmentAttemptQuestions not answered',
        //   'error': queuedAssessmentAttemptQuestions
        // });

        break;
      }
    }

    return this.assessmentAttemptQuestionService.bulkUpdate(id, this.queuedAssessmentAttemptQuestions);

    // reset collection
    // this.queuedAssessmentAttemptQuestions = [];
  }

  updateQuestion(question: any): any {
    return this.assessmentAttemptQuestionService.update(question.assessmentAttemptId, question.id, question);
  }

}
