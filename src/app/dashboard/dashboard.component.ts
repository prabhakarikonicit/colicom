import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentAttempt, Enrollment, Exam, ExamModule, PracticeAttempt, PracticeAttemptsResponse, PracticeProgress, PracticeResults, Progress, StudyProgress } from 'src/app/shared/interfaces/interfaces';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModuleAttemptService } from 'src/app/shared/services/module-attempt.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { OrderByPipe } from '../shared/pipe/order-by.pipe';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  trialMode: boolean = true;
  isExamTabOpen: boolean = true;
  isPreAssessmentTabOpen: boolean = true;
  showModalActivities: boolean = false;
  modalShown: boolean = false;

  overAllReadiness: number = 0;
  modalType: number = 0;
  examTime: number = 0;
  simulatedExamProgressScore: number = 0;
  currentAttemptsPage: number = 1;
  attemptsToDisplay: number = 2;

  examModule: string = '';

  simulatedExamAttempts: AssessmentAttempt[] = [];
  examModules: ExamModule[] = [];
  progresses: Progress[] = [];
  completedAttempts: AssessmentAttempt[] = [];
  displayTheseAttempts: AssessmentAttempt[] = [];
  completedPracticeAttempts: PracticeAttempt[] = [];

  opened: ExamModule = {} as ExamModule;
  enrollment: Enrollment = {} as Enrollment;
  exam: Exam = {} as Exam;
  preAssessmentAttempt: AssessmentAttempt = {} as AssessmentAttempt;
  practiceProgress: PracticeProgress = {} as PracticeProgress;
  practiceResults: PracticeResults = {} as PracticeResults;
  studyProgress: StudyProgress = {} as StudyProgress;
  launch: any;

  constructor(private enrollmentService: EnrollmentService, private globalService: GlobalService, private moduleAttemptService: ModuleAttemptService, private router: Router, private orderByPipe: OrderByPipe, private moduleService: ModuleService) { }

  ngOnInit(): void {

    // remove loading
    this.globalService.hideLoader();

    // remove login class
    this.globalService.selectedItem = 'dashboard';

    this.enrollment = this.enrollmentService.getEnrollment();
    this.exam = this.enrollmentService.getExam();
    this.examTime = Math.floor(this.exam.examTime / 60);
    this.examModules = this.enrollmentService.getExamModules();
    this.progresses = this.enrollmentService.getProgresses();
    this.simulatedExamProgressScore = 0;

    this.completedPracticeAttempts = [];
    this.simulatedExamAttempts = [];
    this.preAssessmentAttempt = {} as AssessmentAttempt;
    this.studyProgress = {} as StudyProgress;
    this.practiceResults = {} as PracticeResults;

    // display vars
    this.isExamTabOpen = false;
    this.isPreAssessmentTabOpen = false;
    this.modalShown = false;
    this.modalType = 2;

    // track if this enrollment is free trial
    this.trialMode = this.enrollmentService.isTrial(this.enrollment);

    // log
    // LogService.activity('view dashboard');

    // overall exam score
    this.overAllReadiness = this.enrollmentService.getOverAllReadinessScore();
    this.loadSimulatedExamResults();
    this.loadPreAssessmentResults();

    // figure out what tab to open
    if (this.getPreAssessmentProgressScore() !== 100) {
      this.isPreAssessmentTabOpen = true;
    } else {
      this.openExamModuleTab(this.enrollmentService.getSelectedExamModule());
    }

  }

  loadStudyResults(examModule: ExamModule): void {
    // get progress
    const data: Progress = this.progresses.filter((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === 'study')[0];
    // load new values
    const unseen: number = data.questionCount - data.correct - data.incorrect
    this.studyProgress = {
      terms: data.questionCount,
      marked: data.bookmarked,
      correct: data.correct,
      missed: data.incorrect,
      unseen: unseen < 0 ? 0 : unseen
    };

  }

  loadPracticeResults(examModule: ExamModule) {
    // get bookmarked
    const data: Progress = this.progresses.filter((progress: Progress) => progress.moduleId === examModule.moduleId && progress.type === 'practice')[0];

    this.practiceProgress = {
      marked: data.bookmarked
    };

    this.moduleAttemptService.queryForEnrollmentModulePractice(this.enrollment.id, examModule.moduleId).subscribe((collection: PracticeAttempt[]) => {
      // reset all
      this.practiceResults = {
        first: {} as PracticeAttempt,
        last: {} as PracticeAttempt,
        best: {} as PracticeAttempt
      };

      if (collection.length === 0) {
        this.completedPracticeAttempts = [];
        return;
      }

      // do we have any completed to show scores?
      this.completedPracticeAttempts = collection.filter((collectionItem: PracticeAttempt) => collectionItem.completed);

      if (this.completedPracticeAttempts.length === 0) {
        this.completedPracticeAttempts = [];
        return;
      }

      // lets sort by newest to oldest
      this.completedPracticeAttempts = this.orderByPipe.transform(this.completedPracticeAttempts, 'id');

      const first: PracticeAttempt = this.completedPracticeAttempts[0];
      let best: PracticeAttempt = first;
      const last: PracticeAttempt = this.completedPracticeAttempts[this.completedPracticeAttempts.length - 1];

      for (let x = 0; x < this.completedPracticeAttempts.length; x++) {
        // find best
        if (this.completedPracticeAttempts[x].score > best.score) {
          best = this.completedPracticeAttempts[x];
        }
      }

      // create practice object
      this.practiceResults = {
        first: first,
        last: last,
        best: best
      };
    });

  }

  loadSimulatedExamResults(): void {
    this.simulatedExamAttempts = this.enrollmentService.getSimulatedExamAttempts();
    this.displayAttempts(1);
  }

  loadPreAssessmentResults(): void {
    if (this.enrollmentService.getPreAssessmentAttempts()?.length > 0) {
      this.preAssessmentAttempt = this.enrollmentService.getPreAssessmentAttempts()[0];
    }
  }

  displayAttempts(page: number): void {
    if (typeof (page) !== 'undefined') {
      this.currentAttemptsPage = page;
    }

    if (this.simulatedExamAttempts && this.simulatedExamAttempts.length > 0) {
      const startIndex: number = (this.currentAttemptsPage - 1) * this.attemptsToDisplay;
      const endIndex: number = startIndex + this.attemptsToDisplay;
      this.completedAttempts = this.simulatedExamAttempts.filter((simulatedExamAttempt: AssessmentAttempt) => simulatedExamAttempt.completed);
      this.displayTheseAttempts = this.completedAttempts.slice(startIndex, endIndex);
    }

  }

  displayPreviousAttempts(): void {
    if (this.currentAttemptsPage == 1) {
      return;
    }

    this.displayAttempts(this.currentAttemptsPage - 1);
  }

  displayNextAttempts(): void {
    this.displayAttempts(this.currentAttemptsPage + 1);
  }

  isLessAttempts(): boolean {
    return this.currentAttemptsPage !== 1;
  }

  isMoreAttempts(): boolean {
    return ((this.currentAttemptsPage * this.attemptsToDisplay) < this.completedAttempts.length);
  }

  /**
   * end display simulated exam attempts
   */
  getPreAssessmentQuestionCount(): number {
    let count: number = 0;

    this.examModules.forEach((module: ExamModule) => {
      count += module.preassessmentQuestions;
    });

    return count;
  }

  getSimulatedExamQuestionCount(): number {
    let count: number = 0;

    this.examModules.forEach((module: ExamModule) => {
      count += module.examQuestions;
    });

    return count;
  }

  getExamModuleReadinessScore(examModule: ExamModule): number {
    return this.enrollmentService.getExamModuleReadinessScore(examModule);
  }

  getSimulatedExamReadinessScore(): number {
    return this.enrollmentService.getSimulatedExamReadinessScore();
  }

  getPreAssessmentProgressScore(): number {
    if (Object.keys(this.preAssessmentAttempt || {}).length && this.preAssessmentAttempt.completed !== null) {
      return 100;
    }

    return 0;
  }

  openPreAssessmentAttempt(): void {
    this.globalService.setLoaderMessage();
    this.router.navigate(['pre-assessment']);
  }

  openStudyAttempt(): void {
    // if trial, can't access simulated exams
    if (this.trialMode && this.globalService.selectedModule.sort > 1) {
      this.globalService.toggleTrialModal();
      return;
    }

    this.globalService.setLoaderMessage();
    this.router.navigate(['study']);

  }

  openPracticeAttempt(): void {
    // if trial, can't access simulated exams
    if (this.trialMode && this.globalService.selectedModule.sort > 1) {
      this.globalService.toggleTrialModal();
      return;
    }

    this.globalService.setLoaderMessage();

    this.router.navigate(['practice']);

  }

  reviewPracticeAttempt(attempt: PracticeAttempt): void {
    this.globalService.setLoaderMessage();

    this.moduleService.setAttempt(attempt);
    this.router.navigate(['/practice/results']);

  }

  openSimulatedExamAttempt(): void {
    // if trial, can't access simulated exams
    if (this.trialMode) {
      this.globalService.toggleTrialModal();
      return;
    }

    this.globalService.setLoaderMessage();
    this.router.navigate(['simulated-exam']);
  }

  reviewSimulatedExamAttempt(attempt: AssessmentAttempt): void {
    this.globalService.setLoaderMessage();
    this.enrollmentService.setSelectedSimulatedExamAttempt(attempt);
    this.router.navigate(['/simulated-exam/results']);
  }

  reviewPreAssessmentAttempt(attempt: AssessmentAttempt): void {
    this.globalService.setLoaderMessage();
    this.enrollmentService.setSelectedPreAssessmentAttempt(attempt);
    this.router.navigate(['pre-assessment/results']);
  }

  /**
   * check what exam module is currently selected
   */
  isOpen(examModule: ExamModule): boolean {
    return this.opened === examModule;
  }

  /**
   * handles click on each category tab
   */
  openExamModuleTab(examModule: ExamModule): void {
    // reset vars
    this.completedPracticeAttempts = [];

    // close assessments if open
    this.isPreAssessmentTabOpen = false;
    this.isExamTabOpen = false;

    if (this.isOpen(examModule)) {
      this.opened = {} as ExamModule;
    } else {
      this.launch = null;
      this.opened = examModule;
      this.globalService.selectedModule = examModule;
      this.enrollmentService.setSelectedExamModule(examModule);

      this.loadStudyResults(examModule);
      this.loadPracticeResults(examModule);
    }
  }

  openPreAssessmentTab(): void {
    this.isPreAssessmentTabOpen = !this.isPreAssessmentTabOpen;
    this.isExamTabOpen = false;
    this.opened = {} as ExamModule;
  }

  openExamTab(): void {
    this.isExamTabOpen = !this.isExamTabOpen;
    this.isPreAssessmentTabOpen = false;
    this.opened = {} as ExamModule;
  }

  showModal(type: number): void {
    this.modalType = type;
    this.modalShown = true;
  }

  hideModal(): void {
    this.modalShown = false;
    this.modalType = 0;
  }

}