import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ReadinessComponent } from './components/readiness/readiness.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { AssessmentModalComponent } from './components/assessment-modal/assessment-modal.component';
import { TrialModalDialogComponent } from './components/trial-modal-dialog/trial-modal-dialog.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { CurrentYearPipe } from './pipe/current-year.pipe';
import { VersionPipe } from './pipe/version.pipe';
import { UrlToEnvironmentPipe } from './pipe/url-to-environment.pipe';
import { OrderByPipe } from './pipe/order-by.pipe';
import { QuestionBoxComponent } from './components/question-box/question-box.component';
import { FormsModule } from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';
import { FilterKeyValPipe } from './pipe/filter-key-val.pipe';
import { SplitByPipe } from './pipe/splitBy.pipe';
import { GlossaryTermsPipe } from './pipe/glossary-terms.pipe';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, ReadinessComponent, ProgressBarComponent, 
    AssessmentModalComponent, AssessmentModalComponent, TrialModalDialogComponent, CurrentYearPipe, VersionPipe, UrlToEnvironmentPipe, OrderByPipe, QuestionBoxComponent, CalculatorComponent, GlossaryTermsPipe, FilterKeyValPipe, SplitByPipe],
  imports: [
    CommonModule,
    FormsModule,
    NgxMasonryModule,
    CountdownModule
  ],
  exports: [
    FooterComponent, HeaderComponent, ReadinessComponent, ProgressBarComponent, AssessmentModalComponent, CurrentYearPipe, VersionPipe, UrlToEnvironmentPipe, OrderByPipe, QuestionBoxComponent, CalculatorComponent, GlossaryTermsPipe, FilterKeyValPipe, SplitByPipe,
    NgxMasonryModule,
    CountdownModule
  ],
  providers: [OrderByPipe, UrlToEnvironmentPipe, GlossaryTermsPipe, FilterKeyValPipe, SplitByPipe]
})
export class SharedModule { }
