import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AssessmentAttempt, Enrollment, EnrollmentResponse, Exam, ExamModule, ExamModulesResponse, Organization, Progress, ProgressDetailsResponse, ProgressResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  selectedExamModuleIndex: number = 0;
  
  examModules: ExamModule[] = [];
  progresses: Progress[] = [];
  simulatedExamAttempts: AssessmentAttempt[] = [];
  preAssessmentAttempts: AssessmentAttempt[] = [];
  questionAttempts: AssessmentAttempt[] = [];

  preAssessmentAttempt: AssessmentAttempt = {} as AssessmentAttempt;
  enrollment: Enrollment = {} as Enrollment;
  organization: Organization = {} as Organization;
  attempt: AssessmentAttempt = {} as AssessmentAttempt;
  exam: Exam = {} as Exam;

  constructor(private http: HttpService) { }

  loadEnrollments(userId: number) {
    return this.http.getData<EnrollmentResponse>(`/users/${userId}/enrollments?includes[]=exam&includes[]=organization`)
      .pipe(map((enrollments: EnrollmentResponse) => {
        return enrollments.items;
      }));
  }

  queryForExamWithModule(examId: number) {
    return this.http.getData<ExamModulesResponse>(`/exams/${examId}/modules?includes[]=module`)
      .pipe(map((modules: ExamModulesResponse) => {
        return modules.items;
      }));
  }

  createStudyProgress(body: any) {
    // todo: test this once
    return this.http.postData<ProgressResponse>(`/enrollments/${body.enrollmentId}/modules/${body.moduleId}/study-progresses`, body)
      .pipe(map((progresses: ProgressResponse) => {
        return progresses.item;
      }));
  }

  createPracticeProgress(body: any) {
    // todo: test this once
    return this.http.postData<ProgressResponse>(`/enrollments/${body.enrollmentId}/modules/${body.moduleId}/practice-progresses`, body)
      .pipe(map((progresses: ProgressResponse) => {
        return progresses.item;
      }));
  }

  getEnrollment(): Enrollment {
    return this.enrollment;
  }

  setEnrollment(enrollment: Enrollment) {
    this.enrollment = enrollment;
  }

  update() {
    // todo: 
    // Enrollment.update({ id: enrollment.id }, enrollment).$promise;
  }

  // organization specific
  setOrganization(organization: Organization): void {
    this.organization = organization;
  }

  getOrganization(): Organization {
    return this.organization;
  }

  // exam specific
  setExam(exam: Exam): void {
    this.exam = exam;
  }

  getExam(): Exam {
    return this.exam;
  }

  // progresses specific
  setProgresses(progresses: Progress[]): void {
    this.progresses = progresses;
  }

  getProgresses(): Progress[] {
    return this.progresses;
  }

  setSimulatedExamAttempts(attempts: AssessmentAttempt[]): void {
    this.simulatedExamAttempts = attempts;
  }

  getSimulatedExamAttempts(): AssessmentAttempt[] {
    return this.simulatedExamAttempts;
  }

  setSelectedSimulatedExamAttempt(attempt: AssessmentAttempt): void {
    this.attempt = attempt;
  }

  getSelectedSimulatedExamAttempt(): AssessmentAttempt {
    return this.attempt;
  }

  setPreAssessmentAttempts(attempts: AssessmentAttempt[]): void {
    this.preAssessmentAttempts = attempts;
  }

  getPreAssessmentAttempts(): AssessmentAttempt[] {
    return this.preAssessmentAttempts;
  }

  setSelectedPreAssessmentAttempt(preAssessmentAttempt: AssessmentAttempt): void {
    this.preAssessmentAttempt = preAssessmentAttempt;
  }

  getSelectedPreAssessmentAttempt(): AssessmentAttempt {
    return this.preAssessmentAttempt;
  }

  setQuestionAttempts(attempts: AssessmentAttempt[]): void {
    this.questionAttempts = attempts;
  }

  getQuestionAttempts(): AssessmentAttempt[] {
    return this.questionAttempts;
  }

  calculateOverAllReadiness(): number {
    let examModulesScore: number = 0;
    let examsScore: number = 0;
    let total: number = 0;

    // talley up progresses pre simualted attempts
    this.examModules.forEach((examModule: ExamModule) => {
      examModulesScore += this.calculateExamModuleReadiness(examModule);
    })

    // need to get average and keep 60%. last 40% is from simulated exams (if score >= 75%)
    total = (examModulesScore / this.examModules.length) * .6;

    // do we have simulated exams?
    const completedAttempts = this.simulatedExamAttempts.filter((simulatedExamAttempt: AssessmentAttempt) => simulatedExamAttempt.completed);

    if (completedAttempts.length > 0) {
      completedAttempts.forEach((completedAttempt: AssessmentAttempt) => {
        if (completedAttempt.score >= 75) {
          examsScore += completedAttempt.score * .25; // each attempt is worth 1/4 of the total
        }
      });
      total += examsScore * .4;
    }

    if (total >= 100) {
      total = 100;
    } else if (total > 0) {
      // if progress, round to nearest 5
      total = 5 * Math.round(total / 5);
    }
    return total;
  }

  calculateExamModuleReadiness(examModule: ExamModule): number {
    const total: number = 0;

    if (this.progresses == undefined) {
      return total;
    }

    const studyItem: Progress | undefined = this.progresses.find((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === 'study');
    const practiceItem: Progress | undefined = this.progresses.find((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === 'practice');

    if (studyItem === undefined || studyItem.score === undefined || practiceItem === undefined || practiceItem.score === undefined) {
      return total;
    }

    const studyScore: number = studyItem.score;
    const practiceScore: number = practiceItem.score;
    const score: number = Math.ceil((studyScore * .1) + (practiceScore * .9));

    // shouldn't be higher than 100
    return score > 100 ? 100 : score;
  }

  // helper methods
  getOverAllReadinessScore(): number {
    return this.calculateOverAllReadiness();
  }

  getExamModuleReadinessScore(examModule: ExamModule): number {
    return this.calculateExamModuleReadiness(examModule);
  }

  /**
        * get total questions, we want that number * 4 correct = 100%
        */
  calculateSimulatedExamReadiness(): number {
    let score: number = 0;
    let totalQuestions: number = 0;
    let totalCorrect: number = 0;

    // do we have any attempts?
    if (this.simulatedExamAttempts == undefined) {
      return score;
    }

    this.examModules.forEach((examModule: ExamModule) => {
      totalQuestions += examModule.examQuestions;
    });

    this.simulatedExamAttempts.forEach((simulatedExamAttempt: AssessmentAttempt) => {
      totalCorrect += simulatedExamAttempt.correct;
    });

    score = Math.round(totalCorrect / (totalQuestions * 4) * 100);

    // score shouldn't be higher than 100
    return score > 100 ? 100 : score;
  }

  getSimulatedExamReadinessScore(): number {
    return this.calculateSimulatedExamReadiness();
  }

  /**
   * Checks if this enrollment is of type trial
   * @param enrollment
   * @returns {boolean}
   */
  isTrial(enrollment: Enrollment): boolean {
    return enrollment.type === 1;
  }

  setExamModules(examModules: ExamModule[]): void {
    this.examModules = examModules;
  }

  getExamModules(): ExamModule[] {
    return this.examModules;
  }

  getExamModule(index: number): ExamModule {
    return this.examModules[index];
  }

  setSelectedExamModule(examModule: ExamModule): void {
    for (let x = 0; x < this.examModules.length; x++) {
      if (examModule.id == this.examModules[x].id) {
        this.selectedExamModuleIndex = x;
        break;
      }
    }
  }

  getSelectedExamModule(): ExamModule {
    return this.examModules[this.selectedExamModuleIndex];
  }

}
