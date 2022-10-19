import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamModule, Progress, StudyItem } from '../shared/interfaces/interfaces';
import { StudyResolverService } from '../shared/resolvers/study-resolver.service';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { GlobalService } from '../shared/services/global.service';
import { ProgressQuestionsMangerService } from '../shared/services/progress-questions-manger.service';
import { StudyService } from '../shared/services/study.service';


@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {

  toggle: number = 0;

  questionGroups: any;
  examModules: ExamModule[] = [];
  studyModes: StudyItem[] = [];
  studyOptions: StudyItem[] = [];
  studyQuantities: StudyItem[] = [];
  selectedExamModule: ExamModule = {} as ExamModule;
  selectedMode: StudyItem = {} as StudyItem;
  selectedOption: StudyItem = {} as StudyItem;
  selectedQuantity: StudyItem = {} as StudyItem;

  selectedExamModuleValue: string = '';
  selectedModeValue: string = '';
  selectedOptionValue: string | number = '';
  selectedQuantityValue: string = '';

  constructor(private globalService: GlobalService, private enrollmentService: EnrollmentService, 
    private studyService: StudyService, public progressQuestionsMangerService: ProgressQuestionsMangerService, private router: Router, private studyResolverService: StudyResolverService) { }

  ngOnInit(): void {
    // log
    // LogService.activity('view study');

    // scroll to top
    window.scrollTo(0, 0);

    // global header
    this.globalService.selectedItem = 'study';

    // remove loading
    this.globalService.hideLoader();

    this.globalService.selectedModule = this.enrollmentService.getSelectedExamModule();
    this.questionGroups = [];

    // restore defaults for dropdowns incase we came from another session
    this.studyService.restoreDropdownDefaults();

    // for select dropdowns
    this.examModules = this.enrollmentService.getExamModules();
    this.studyModes = this.studyService.getStudyModes();
    this.studyOptions = this.studyService.getStudyOptions();
    this.studyQuantities = this.studyService.getStudyQuantities();

    // defaults
    this.selectedExamModule = this.enrollmentService.getSelectedExamModule();
    this.selectedMode = this.studyModes[0];
    this.selectedOption = this.studyOptions[0];
    this.selectedQuantity = this.studyQuantities[0];

    this.setDefaultOptions(); // todo 4200

    // get questions
    this.progressQuestionsMangerService.setProgressQuestions(this.studyService.getProgressQuestions());

    // compare with progress and send recalc if needed
    const progress: Progress = this.studyService.getProgress();
    if (progress.bookmarked !== this.progressQuestionsMangerService.getTotalBookmarked() ||
      progress.correct !== this.progressQuestionsMangerService.getTotalCorrect() ||
      progress.incorrect !== this.progressQuestionsMangerService.getTotalIncorrect()) {
      this.studyService.recalculateProgress(progress.id);
    }

    if (this.progressQuestionsMangerService.getTotalIncorrect() > 0) {
      this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === 'incorrect')[0].enabled = true;
    }

    if (this.progressQuestionsMangerService.getTotalNotViewed() > 0) {
      // find the right option
      this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === 'unseen')[0].enabled = true;
    }

    // init
    this.updateOptions(this.progressQuestionsMangerService.getTotalBookmarked());

    // all done, load up a group
    if (this.progressQuestionsMangerService.getTotalBookmarked() > 0) {
      this.openTab('bookmarked');
    } else {
      this.openTab('all');
    }

  }

  // lets reload this page
  changeExamModule(): void {
    // if trial, can only access first exam module, use sort to find the position of the exam module
    if (this.enrollmentService.isTrial(this.enrollmentService.getEnrollment()) && this.selectedExamModule.sort > 1) {
      this.selectedExamModule = this.examModules[0];
      this.globalService.toggleTrialModal();
      return;
    }

    const selectedExamModule: ExamModule = this.examModules.filter((examModule: ExamModule) => examModule.name === this.selectedExamModuleValue)[0];
    this.selectedExamModule = selectedExamModule;
    this.globalService.showLoader();
    this.enrollmentService.setSelectedExamModule(this.selectedExamModule);

    // refresh the state with new resolve call
    this.studyResolverService.loadProgressQuestionsForExamModuleWithQuestionsAndAnswers().subscribe(_ => {
      this.ngOnInit();
    })

  }

  // tabs
  openTab(value: string | number, count?: number): void {
    // do nothing if 0 count of questions
    if (count === 0) {
      return;
    }

    // else lets check what we need to show
    const selectedStudyOptions: StudyItem = this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === value)[0];
    switch (selectedStudyOptions.value) {
      case "bookmarked":
        this.toggle = 1;
        this.questionGroups = this.progressQuestionsMangerService.getBookmarked();
        this.selectedOption = selectedStudyOptions
        break;
      case "incorrect":
        this.toggle = 2;
        this.questionGroups = this.progressQuestionsMangerService.getIncorrect();
        this.selectedOption = selectedStudyOptions
        break;
      case "unseen":
        this.toggle = 3;
        this.questionGroups = this.progressQuestionsMangerService.getNotAnswered();
        this.selectedOption = selectedStudyOptions
        break;
      default: // all
        this.toggle = 4;
        this.questionGroups = this.progressQuestionsMangerService.getProgressQuestions();
        this.selectedOption = selectedStudyOptions
    }

    this.updateQuantity(this.questionGroups.length);
    this.setDefaultOptions();

  }

  start(): void {
    // show loading
    this.globalService.showLoader();

    this.studyService.createAttempt(
      this.enrollmentService.getEnrollment().id,
      this.selectedExamModule.module.id,
      'study',
      this.selectedQuantity.value,
      this.selectedOption.value
    ).subscribe((collection: any) => {
      this.studyService.setAttempt(collection);
      this.router.navigate(['study', 'attempt', this.selectedMode.value]);
    })

  }

  bookmark(progressQuestion: any): void {
    const progress = this.studyService.getProgress();
    // update tabs
    if (progressQuestion.bookmarked) {
      progress.bookmarked = progress.bookmarked <= 0 ? 0 : progress.bookmarked - 1;
    } else {
      progress.bookmarked++;
    }
    this.updateOptions(this.progressQuestionsMangerService.getTotalBookmarked());
    this.studyService.bookmarkProgressQuestion(progressQuestion, progress);
  }

  // update the study options dropdown values
  updateOptions(total: number): void {
    // update dropdown options
    const item = this.studyOptions.filter((studyOption: StudyItem) => studyOption.value === 'bookmarked')[0];

    if (total > 0) {
      item.enabled = true;
    } else {
      item.enabled = false;
      // change selection if currently on it
      if (this.selectedOption.value == item.value) {
        this.selectedOption = this.studyQuantities.filter((studyQuantitie: StudyItem) => studyQuantitie)[0];
      }
    }
  }

  updateQuantity(total: number): void {
    let item;
    // show all
    if (total <= 20) {
      this.selectedQuantity = this.studyQuantities.filter((studyQuantitie: StudyItem) => studyQuantitie.value === 'all')[0];
      this.selectedQuantity.enabled = true;
    }

    // show 10
    if (total >= 10) {
      item = this.studyQuantities.filter((studyQuantitie: StudyItem) => studyQuantitie.value === 10)[0];
      item.enabled = true;
    }

    // if we have more than 20 don't allow all
    if (total > 20) {
      // hide all
      item = this.studyQuantities.filter((studyQuantitie: StudyItem) => studyQuantitie.value === 'all')[0];
      item.enabled = false;

      // show 20
      this.selectedQuantity = this.studyQuantities.filter((studyQuantitie: StudyItem) => studyQuantitie.value === 20)[0];
      this.selectedQuantity.enabled = true;
    }
  }

  print(): void {
    window.print();
  }

  changeStudyMode() {
    const studyMode: StudyItem = this.studyModes.filter((studyMode: StudyItem) => studyMode.name === this.selectedModeValue)[0];
    this.selectedMode = studyMode;
  }

  changeStudyQuantity() {
    const studyQuantity: StudyItem = this.studyQuantities.filter((studyQuantity: StudyItem) => studyQuantity.name === this.selectedQuantityValue)[0];
    this.selectedQuantity = studyQuantity;
  }

  setDefaultOptions() {
    this.selectedExamModuleValue = this.selectedExamModule.name;
    this.selectedModeValue = this.selectedMode.name;
    this.selectedOptionValue = this.selectedOption.value;
    this.selectedQuantityValue = this.selectedQuantity.name;
  }
}
