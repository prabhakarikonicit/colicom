import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UrlToEnvironmentPipe } from 'src/app/shared/pipe/url-to-environment.pipe';
import { environment } from 'src/environments/environment';
import { Enrollment, Exam, ExamModule } from '../interfaces/interfaces';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  loading: boolean = false;
  modalShown: boolean = false;
  selectedItem: string = '';
  loadingMessage: string = 'Loading...';
  selectedModule: ExamModule = {} as ExamModule;
  selectedEnrollment: Enrollment = {} as Enrollment;
  selectedExam: Exam = {} as Exam;
  enrollments: Enrollment[] = [];

  constructor(private loginService: LoginService, private sanitizer: DomSanitizer, private urlToEnvironmentPipe: UrlToEnvironmentPipe) { }

  goToMarketingSiteExtensions(): void {
    window.open(this.urlToEnvironmentPipe.transform(environment.MARKETING_SITE));
  }

  goToMarketingSite(): void {
    window.open(this.urlToEnvironmentPipe.transform(environment.MARKETING_SITE_EXTENSIONS));
  }

  goToMarketingSupportSite(): void {
    window.open(this.urlToEnvironmentPipe.transform(environment.MARKETING_SUPPORT_SITE));
  }

  isTrialMode(): boolean {
    return this.selectedEnrollment && this.selectedEnrollment.type === 1;
  }

  isDemo(): boolean {
    if (!this.loginService.isAuthenticated()) {
      return false;
    }
    return this.loginService.getCurrentUser().email.toLowerCase() === 'demo@hondros.com';
  }

  toggleTrialModal(): void {
    this.modalShown = !this.modalShown;
  }

  showLoader(): void {
    this.loading = true;
  }

  hideLoader(): void {
    this.loading = false;
    this.loadingMessage = 'Loading...';
  }

  setLoaderMessage(message: string = 'Loading...'): void {
    if (!!message) {
      this.showLoader();
    }
    this.loadingMessage = message;
  }

  trustAsHtml(text: string): string {
    return this.sanitizer.sanitize(1, text) as string;
  } 


  getTrustedText(text : string) {
    return this.sanitizer.sanitize(1, text);
  }

  filterKeyVal(items: any[], filter: any) {
    let key = Object.keys(filter);
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out

    return items.filter(item => {
      let trueCounter = 0;
      key.forEach((e) => {
        if (item[e] == filter[e]) trueCounter++
      });
      return trueCounter == key.length;
      // item[key]==filter[key]
    });

  }

  shuffleArray(array:any[]) {
    let m = array.length, t, i;

    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
  }

}
