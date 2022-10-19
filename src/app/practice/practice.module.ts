import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeComponent } from './practice.component';
import { PracticeResultComponent } from './practice-result/practice-result.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PracticeResolverService } from '../shared/resolvers/practice-resolver.service';
import { PracticeResultResolver } from '../shared/resolvers/practice-result-resolver.resolver';
import { PracticeAttemptResolver } from '../shared/resolvers/practice-attempt.resolver';
import { AttemptComponent } from './attempt/attempt.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PracticeComponent,
    resolve: {ProgressQuestionsResponse: PracticeResolverService}
  },
  {
    path: 'practice/results',
    component: PracticeResultComponent,
    resolve: {ProgressQuestionsResponse: PracticeResultResolver}
  },
  {
    path: 'attempt',
    component: AttemptComponent,
    resolve: {practiceAttemptResolverResponse : PracticeAttemptResolver}
  }
];
@NgModule({
  declarations: [
    PracticeComponent,
    PracticeResultComponent,
    AttemptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PracticeModule { }
