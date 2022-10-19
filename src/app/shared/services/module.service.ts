import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Enrollment, ExamModule, ModuleAttempts, PracticeAttempt, Progress, ProgressQuestions } from '../interfaces/interfaces';
import { EnrollmentService } from './enrollment.service';
import { GlobalService } from './global.service';
import { ProgressQuestionService } from './progress-question.service';
import { ModuleAttemptService } from './module-attempt.service';
import { ModuleAttemptQuestionService } from './module-attempt-question.service';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  // properties
  // studyType = 'study|practice' // tried using this but never worked. Tried setting in study/practice service and always overwrote other

  // collections
  progressQuestions: ProgressQuestions[] = [];
  queuedModuleAttemptQuestions: any[] = [];

  // objects
  progress: Progress = {} as Progress;
  attempt: PracticeAttempt = {} as PracticeAttempt;

  // counters - used for pagination
  totalProgressQuestions: number = 0;

  constructor(private enrollmentService: EnrollmentService, private progressQuestionService: ProgressQuestionService, private globalService: GlobalService, private moduleAttemptService: ModuleAttemptService, public moduleAttemptQuestionService: ModuleAttemptQuestionService, public progressService: ProgressService) { }

  loadProgress(id: number) {
    // return Progress.get({ id: id, enrollmentId: this.enrollmentService.getEnrollment().id }, function (data: any) {
    //   this.progress = data;
    // });
  }

  loadProgressQuestionsWithQuestionsAndAnswers(progress: Progress, params: any) {
    const options: any = {
      progressId: progress.id
    };
    const enrollment: Enrollment = this.enrollmentService.getEnrollment();

    // default
    if (typeof (params) !== 'undefined' && typeof (params.bookmarked) !== undefined) {
      options.bookmarked = true;
    }

    return this.progressQuestionService.queryForProgressWithQuestionsAndAnswers(enrollment, progress.id)
      .pipe(map((collections: any) => {
        collections = this.sanitizeQuestions(collections);
        this.progressQuestions = collections;
        this.totalProgressQuestions = collections.length;
        return collections;
      }));

  }

  loadProgressQuestionsForModuleAttemptIdWithQuestionsAndAnswers(attemptId: number) {
    return this.progressQuestionService.queryForModuleAttemptWithQuestionsAndAnswers(attemptId)
      .pipe(map((progressDetails: ProgressQuestions[]) => {
        progressDetails = this.sanitizeQuestions(progressDetails);

        // store in service
        this.progressQuestions = progressDetails;
        this.totalProgressQuestions = progressDetails.length;
        return progressDetails;

      }));
  }

  createAttempt(enrollmentId: number, moduleId: number, type: string, quantity: number | string, filter?: number | string) {
    // default
    if (typeof (filter) === 'undefined') {
      filter = 'all';
    }

    // default
    if (typeof (quantity) === 'undefined') {
      quantity = 20;
    }

    const attempt: ModuleAttempts = {
      enrollmentId: enrollmentId,
      moduleId: moduleId,
      type: type,
      filter: filter,
      quantity: quantity
    }

    // return promise so externally can do what they want
    return this.moduleAttemptService.queryForCreatingAnAttempt(attempt);
  }

  recalculateProgress(id: number) {
    return this.progressService.recalculate(id, this.enrollmentService.getEnrollment().id).subscribe((data: any) => {
      this.progress = data.item;
    });
  };

  // utilities
  sanitizeQuestions(questions: any) {
    // sanitize all html
    questions.forEach((question: any) => {

      question.question.questionText = this.globalService.trustAsHtml(question.question.questionText);

      // and answers
      question.question.answers.forEach((answer: any) => {
        answer.answerText = this.globalService.trustAsHtml(answer.answerText);
      });

      // any feedback?
      if (question.question.feedback !== null) {
        question.question.feedback = this.globalService.trustAsHtml(question.question.feedback);
      }

      // any techniques?
      if (question.question.techniques !== null) {
        question.question.techniques = this.globalService.trustAsHtml(question.question.techniques);
      }
    });
    return questions;
  };

  loadProgressForExamModule(examModule: ExamModule, type: string): void {
    const progresses: Progress[] = this.enrollmentService.getProgresses();
    const progress: Progress = progresses.filter((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === type)[0];
    return this.loadProgress(progress.id);
  }

  setProgress(progress: Progress): void {
    this.progress = progress;
  }

  getProgress(): Progress {
    return this.progress;
  }

  // progress question related
  // need to get the module id from exam module to load from progress
  loadProgressQuestionsForExamModuleWithQuestionsAndAnswers(examModule: ExamModule, type: string, params?: any) {
    const progresses: Progress[] = this.enrollmentService.getProgresses();
    const progress: Progress = progresses.filter((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === type)[0];
    return this.loadProgressQuestionsWithQuestionsAndAnswers(progress, params);
  }

  setProgressQuestions(pqs: any) {
    this.progressQuestions = pqs;
  }

  getProgressQuestions() {
    return this.progressQuestions;
  }

  getTotalProgressQuestions(): number {
    return this.totalProgressQuestions;
  }

  setTotalProgressQuestions(pq: any) {
    this.totalProgressQuestions = pq;
  }

  bookmarkProgressQuestion(progressQuestion: any, progress: any) {
    // update question
    progressQuestion.bookmarked = !progressQuestion.bookmarked;

    // save
    this.progressQuestionService.update(progressQuestion, this.enrollmentService.getEnrollment().id).subscribe();
    // save the progress as well
    this.progressService.update(this.enrollmentService.getEnrollment().id, progress).subscribe();
  }


  setAttempt(attempt: PracticeAttempt): void {
    this.attempt = attempt;
  }

  getAttempt(): PracticeAttempt {
    return this.attempt;
  }

  // module attempt questions methods
  addToModuleAttemptQuestionUpdateQueue(moduleAttemptQuestion: any) {
    const questionCopy: any = JSON.parse(JSON.stringify(moduleAttemptQuestion));
    questionCopy.question = null;
    this.queuedModuleAttemptQuestions.push(questionCopy);
  }

  bulkUpdateQueuedModuleAttemptQuestionsWithProgress() {
    // check if we have anything in the queue
    if (this.queuedModuleAttemptQuestions[0] == undefined) {
      return false;
    }

    // get the module id from the first question attempt
    const moduleId: number = this.queuedModuleAttemptQuestions[0].moduleAttemptId;

    this.moduleAttemptQuestionService.bulkUpdate(moduleId, this.queuedModuleAttemptQuestions).subscribe(res => {
      // reset collection
      this.queuedModuleAttemptQuestions = [];
    });

    // go ahead and update the progress for this module as well to keep data synced
    // update the score for study
    if (this.progress.type == 'study') {
      this.progress.score = Math.floor(this.progress.correct / this.progress.questionCount * 100);
    }

    return this.progressService.update(this.enrollmentService.getEnrollment().id, this.progress);
  }


}
