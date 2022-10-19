import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamModule, StudyItem } from 'src/app/shared/interfaces/interfaces';
import { EnrollmentService } from 'src/app/shared/services/enrollment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModuleAttemptService } from 'src/app/shared/services/module-attempt.service';
import { StudyService } from 'src/app/shared/services/study.service';

@Component({
  selector: 'app-study-results',
  templateUrl: './study-results.component.html',
  styleUrls: ['./study-results.component.scss']
})
export class StudyResultsComponent implements OnInit {

  selectedExamModuleValue: string = '';
  selectedModeValue: string = '';
  selectedOptionValue: string | number = '';
  selectedQuantityValue: string = '';

  toggle: number = 0;

  
  examModules: ExamModule[] = [];
  studyModes: StudyItem[] = [];
  studyOptions: StudyItem[] = [];
  studyQuantities: StudyItem[] = [];

  selectedExamModule: ExamModule = {} as ExamModule;
  selectedMode: StudyItem = {} as StudyItem;
  selectedOption: StudyItem = {} as StudyItem;
  selectedQuantity: StudyItem = {} as StudyItem;

  questionGroups: any;
  attempt: any;
  module: any;
  progress: any;
  progressQuestions: any;

  constructor(private globalService: GlobalService, private enrollmentService: EnrollmentService,
    private studyService: StudyService, private router: Router, private moduleAttemptService: ModuleAttemptService) { }

  ngOnInit(): void {

    // global header
    this.globalService.selectedItem = 'study';

    // remove loading
    this.globalService.hideLoader();

    // restore defaults for dropdowns incase we came from another session
    this.studyService.restoreDropdownDefaults();

    this.attempt = this.studyService.getAttempt();
    this.module = this.enrollmentService.getSelectedExamModule();
    this.questionGroups = [];

    // // log
    // LogService.activity('study attempt results', JSON.stringify({
    //   id: this.attempt.id,
    //   questionCount: this.attempt.questionCount,
    //   correct: this.attempt.correct,
    //   incorrect: this.attempt.incorrect,
    //   score: this.attempt.score,
    //   bookmarked: this.attempt.bookmarked,
    //   unbookmarked: this.attempt.unbookmarked,
    //   totalTime: this.attempt.totalTime
    // }));

    // progress
    this.progressQuestions = this.studyService.getProgressQuestions();

    // for select dropdowns
    this.examModules = this.enrollmentService.getExamModules();
    this.studyModes = this.studyService.getStudyModes();
    this.studyOptions = this.studyService.getStudyOptions();
    this.studyQuantities = this.studyService.getStudyQuantities();
    this.setDefaultOptions();

    // disable options except for all
    this.studyOptions.forEach((studyOption: StudyItem) => {
      studyOption.enabled = false;
      if (studyOption.value === 'all') {
        studyOption.enabled = true;
      }
    });

    // disable quantity all
    this.studyQuantities.forEach((studyQuantity: StudyItem) => {
      studyQuantity.enabled = false;
      if (studyQuantity.value === 'all') {
        studyQuantity.enabled = true;
      }
    });

    // defaults
    this.selectedExamModule = this.enrollmentService.getSelectedExamModule();
    this.selectedMode = this.studyModes[0];
    this.selectedOption = this.studyOptions[0];
    this.selectedQuantity = this.studyQuantities[1]; // not all

    this.progress = {
      terms: this.attempt.questionCount,
      marked: this.attempt.bookmarked,
      missed: this.attempt.incorrect,
      score: this.attempt.score
    };

    // update dropdown options
    if (this.progress.marked > 0) {
      // since we have marked, set default
      this.selectedOption = this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === 'bookmarked')[0];
      this.selectedOption.enabled = true;
    }

    if (this.progress.missed > 0) {
      this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === 'incorrect')[0].enabled = true;
    }

    // all done, load up a group
    if (this.progress.marked > 0) {
      this.openTab('bookmarked');
    } else {
      this.openTab('all');
    }
  }

  // tabs
  openTab(value: string | number, count?: number): void {
    // do nothing if 0 count of questions
    if (count === 0) {
      return;
    }

    // else lets check what we need to show
    const selectedStudyOptions: StudyItem = this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === value)[0];
    switch (value) {
      case "bookmarked":
        this.toggle = 1;
        this.questionGroups = this.progressQuestions.filter((progressQuestion: any) => progressQuestion.bookmarked === true);
        this.selectedOption = selectedStudyOptions;
        break;
      case "incorrect":
        this.toggle = 2;
        this.questionGroups = this.progressQuestions.filter((progressQuestion: any) => progressQuestion.answered === true && progressQuestion.correct === false);
        this.selectedOption = selectedStudyOptions;
        break;
      default: // all
        this.toggle = 3;
        this.questionGroups = this.progressQuestions;
        this.selectedOption = selectedStudyOptions;
    }
    this.setDefaultOptions();

  }

  start(): void {
    // if trial, can only access first exam module, use sort to find the position of the exam module
    if (this.enrollmentService.isTrial(this.enrollmentService.getEnrollment()) && this.selectedExamModule.sort > 1) {
      this.selectedExamModule = this.examModules[0];
      this.globalService.toggleTrialModal();
      return;
    }

    // show loading
    this.globalService.setLoaderMessage();

    const attempt = {
      enrollmentId: this.enrollmentService.getEnrollment().id,
      moduleId: this.selectedExamModule.module.id,
      type: "study",
      filter: this.selectedOption.value,
      quantity: this.selectedQuantity.value
    };

    // if we are trying a different exam module, for now, since we don't have any data on it,
    // default filter to all
    if (this.selectedExamModule != this.enrollmentService.getSelectedExamModule()) {
      attempt.filter = 'all';
    }

    this.enrollmentService.setSelectedExamModule(this.selectedExamModule);

    this.moduleAttemptService.queryForCreatingAnAttempt(attempt).subscribe(collection => {
      this.studyService.setAttempt(collection);
      this.router.navigate(['study', 'attempt', this.selectedMode.value]);
    });

  }

  bookmark(progressQuestion: any): void {
    // update tabs
    const progress = this.studyService.getProgress();
    if (progressQuestion.bookmarked) {
      this.progress.marked--;
      progress.bookmarked = progress.bookmarked <= 0 ? 0 : progress.bookmarked - 1;
    } else {
      this.progress.marked++;
      progress.bookmarked++;
    }

    // todo 4200
    this.studyService.bookmarkProgressQuestion(progressQuestion, progress);
  }

  print(): void {
    window.print();
  }

  changeStudyMode(): void {
    const studyMode: StudyItem = this.studyModes.filter((studyMode: StudyItem) => studyMode.name === this.selectedModeValue)[0];
    this.selectedMode = studyMode;
  }

  changeStudyQuantity(): void {
    const studyQuantity: StudyItem = this.studyQuantities.filter((studyQuantity: StudyItem) => studyQuantity.name === this.selectedQuantityValue)[0];
    this.selectedQuantity = studyQuantity;
  }

  setDefaultOptions(): void {
    this.selectedExamModuleValue = this.selectedExamModule.name;
    this.selectedModeValue = this.selectedMode.name;
    this.selectedOptionValue = this.selectedOption.value;
    this.selectedQuantityValue = this.selectedQuantity.name;
  }

  changeExamModule(): void {
    const selectedExamModule: ExamModule = this.examModules.filter((examModule: ExamModule) => examModule.name === this.selectedExamModuleValue)[0];
    this.selectedExamModule = selectedExamModule;
  }

}
