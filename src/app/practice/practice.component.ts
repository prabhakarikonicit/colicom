import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { ModuleAttemptService } from 'src/app/shared/services/module-attempt.service';
import { ModuleService } from 'src/app/shared/services/module.service';
import { ProgressQuestionManagerService } from 'src/app/shared/services/progress-question-manager.service';
import { Enrollment, ExamModule, PracticeAttempt, ProgressQuestion, ProgressQuestions } from '../shared/interfaces/interfaces';


@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

  selectedExamModule: ExamModule = {} as ExamModule;
  examModules: ExamModule[] = [];
  attempts: PracticeAttempt[] = [];
  displayTheseAttempts: PracticeAttempt[] = [];
  toggle: number = 0;
  practiceQuestions: number = 0;
  questionGroups: ProgressQuestions[] = []
  enrollment: Enrollment = {} as Enrollment;
  currentAttemptsPage = 1;
  attemptsToDisplay = 3;
  progress: any;
  getQuestionGroupsReady=false;
  getAttemptsReady=false;
  constructor(
    private enrollmentService: EnrollmentService,
    private moduleAttemptService: ModuleAttemptService,
    private loginService: LoginService,
    private router: Router,
    private globalService: GlobalService,
    private moduleService: ModuleService,
    public pqManager: ProgressQuestionManagerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.examModules = this.enrollmentService.getExamModules();
    this.enrollment = this.enrollmentService.getEnrollment();
    this.selectedExamModule = this.enrollmentService.getSelectedExamModule();
    this.progress = this.moduleService.getProgress()

    this.getQuestionGroups(
      this.activatedRoute.data,
      (e: any) => { this.onGetQuestGroupSubscription(e.ProgressQuestionsResponse) }
    );

    this.getAttempts(); // get practice attempts
  }
  displayAttempts(page?: number): void {
    if (typeof (page) !== 'undefined' && typeof (page) !== 'object') {
      this.currentAttemptsPage = page;
    }

    if (this.attempts.length === 0) {
      return;
    }

    const startIndex = (this.currentAttemptsPage - 1) * this.attemptsToDisplay;
    const endIndex = startIndex + this.attemptsToDisplay;
    this.displayTheseAttempts = this.attempts.slice(startIndex, endIndex);
  }
  displayNextAttempts(): void {
    this.displayAttempts(this.currentAttemptsPage + 1);
  }
  changeExamModule() {
    // if trial, can only access first exam module, use sort to find the position of the exam module
    if (this.enrollmentService.isTrial(this.enrollmentService.getEnrollment()) && this.selectedExamModule.sort > 1) {
      this.selectedExamModule = this.examModules[0];
      this.globalService.toggleTrialModal();
      return;
    }

    this.globalService.showLoader()
    this.enrollmentService.setSelectedExamModule(this.selectedExamModule);
    this.globalService.selectedModule=this.selectedExamModule;
    // refresh the state with new resolve call
    this.fetchPageAPI();
  }

  start() {
    // show loading
    this.globalService.showLoader();

    this.moduleService.createAttempt(
      this.enrollmentService.getEnrollment().id,
      this.selectedExamModule.module.id,
      'practice',
      this.selectedExamModule.practiceQuestions, ''
    ).subscribe((newAttempt: any) => {
      this.moduleService.setAttempt(newAttempt);
      this.router.navigate(['practice/attempt']);
    });
  }
  
  resume(attempt: PracticeAttempt) {
    this.globalService.showLoader()

    this.moduleService.setAttempt(attempt);

    this.router.navigate(['/practice/attempt']);
  }
  isLessAttempts(): boolean {
    return this.currentAttemptsPage !== 1;
  }
  displayPreviousAttempts() {
    if (this.currentAttemptsPage == 1) {
      return;
    }

    this.displayAttempts(this.currentAttemptsPage - 1);
  }

  bookmark(progressQuestion: ProgressQuestions) {
    const progress = this.moduleService.getProgress();

    // update tabs
    if (progressQuestion.bookmarked) {
        progress.bookmarked = progress.bookmarked <= 0 ? 0 : progress.bookmarked - 1;
    } else {
        progress.bookmarked++;
    }

    this.moduleService.bookmarkProgressQuestion(progressQuestion, progress);
  }
  print() {
    window.print();
  }
  review(attempt: PracticeAttempt) {
    this.globalService.showLoader()

    this.moduleService.setAttempt(attempt);

    this.router.navigate(['/practice/results']);
  }
  isMoreAttempts(): boolean {
    return ((this.currentAttemptsPage * this.attemptsToDisplay) < this.attempts.length);
  }
  /**
   * calls both the api's question grp and practice attempts
   */
  fetchPageAPI() {
    this.getQuestionGroupsReady=false;
    this.getAttemptsReady=false;
    this.getQuestionGroups(
      this.moduleService.loadProgressQuestionsForExamModuleWithQuestionsAndAnswers(this.selectedExamModule, 'practice', { bookmarked: true }),
      (e: any) => { this.onGetQuestGroupSubscription(e) }
    );// get Question Group
    this.getAttempts();// get practice attempts
  }

  /**
   * get the attempts list.
   */
  getAttempts() {
    const user = this.loginService.getCurrentUser();
    this.moduleAttemptService.queryForEnrollmentModulePractice(this.enrollment.id, this.selectedExamModule.moduleId).subscribe((collection: any) => {
      this.attempts = collection;
      // display attempts
      this.displayAttempts(1);
      this.getAttemptsReady=true;
      this.globalService.loading=this.checkReadyState();
    });
  }
  /**
   * to get the questionGroups (question cards in the bottom of the page)
   * @param subscriberFn subscriber function
   * @param actionfn function body which will execute after the object function.
   */
  getQuestionGroups(subscriberFn: any, actionfn: any) {
    subscriberFn
      .subscribe((collection: any) => {
        actionfn(collection);
      });
  }

  /**
   * what is to be executed after the subscription.
   * @param collection subscription response.
   */
  onGetQuestGroupSubscription(collection: any) {
    this.pqManager.setProgressQuestions(this.moduleService.getProgressQuestions());
    this.questionGroups = this.pqManager.getBookmarked();
    this.getQuestionGroupsReady=true;
    this.globalService.loading=this.checkReadyState();
  }
  checkReadyState(){
    if(this.getQuestionGroupsReady&&this.getAttemptsReady)return false
    else return true;
  }
}
