import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StudyComponent } from './study.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StudyResolverService } from '../shared/resolvers/study-resolver.service';
import { StudyResultsComponent } from './study-results/study-results.component';
import { StudyResultResolverService } from '../shared/resolvers/study-result-resolver.service';
import { FillintheblankComponent } from './fillintheblank/fillintheblank.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { MatchingComponent } from './matching/matching.component';
import { StudyAttemptComponent } from './study-attempt/study-attempt.component';
import { ModuleAttemptQuestionResolverService } from '../shared/resolvers/module-attempt-question-resolver.service';
import { NgDragDropModule } from 'ng-drag-drop';

const routes: Routes = [
  {
    path: '',
    component: StudyComponent,
    resolve: { response1: StudyResolverService }
  },
  {
    path: 'results',
    component: StudyResultsComponent,
    resolve: { response1: StudyResultResolverService }
  },
  {
    path: 'attempt/:mode',
    component: StudyAttemptComponent,
    resolve: { moduleAttemptQuestionResponse: ModuleAttemptQuestionResolverService, response1: StudyResultResolverService }
  },
  {
    path: 'attempt',
    component: StudyAttemptComponent,
    resolve: { moduleAttemptQuestionResponse: ModuleAttemptQuestionResolverService, response1: StudyResultResolverService }
  }
];

@NgModule({
  declarations: [
    StudyComponent,
    StudyResultsComponent,
    FillintheblankComponent,
    FlashcardComponent,
    MatchingComponent,
    StudyAttemptComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgDragDropModule.forRoot(),
    FormsModule
  ],
  exports: [
    StudyComponent
  ]
})
export class StudyModule { }
