import { Injectable } from '@angular/core';
import { AssessmentAttemptQuestionService } from './assessment-attempt-question.service';
import { AssessmentService } from './assessment.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SimulatedExamService extends AssessmentService {

  constructor(globalService: GlobalService, assessmentAttemptQuestionService: AssessmentAttemptQuestionService) {
    super(globalService, assessmentAttemptQuestionService);
  }

  cleanUpQuestion(question: any) {
    const objectToSave: any = {};
    const propertiesToKeep = [
      'id',
      'assessmentAttemptId',
      'viewed',
      'answered',
      'correct',
      'bookmarked',
      'answer',
    ];

    propertiesToKeep.forEach((propertieToKeep: string) => {
      propertieToKeep
      if (question.hasOwnProperty(propertieToKeep)) {
        objectToSave[propertieToKeep] = question[propertieToKeep];
      }
    });

    return objectToSave;
  }

  override updateQuestion(question: any): any {
    const cleanQuestion = this.cleanUpQuestion(question);

   return super.updateQuestion(cleanQuestion)
   .subscribe()

      // 4200
      // .then(function (result) {


      //   if (!result.hasOwnProperty('item')
      //     || !result.item.hasOwnProperty('answered')
      //     || !result.item.answered) {

      //     _LTracker.push({
      //       'text': 'Simulated Exam: updateQuestion success but did not save correctly',
      //       'error': result
      //     });
      //   }

      // }, function (error) {

      //   _LTracker.push({
      //     'text': 'Simulated Exam: updateQuestion error',
      //     'error': error
      //   });

      // });
  };


}
