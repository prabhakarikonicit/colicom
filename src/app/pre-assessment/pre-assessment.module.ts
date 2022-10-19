import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreAssessmentComponent } from './pre-assessment.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttemptComponent } from './attempt/attempt.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ResultComponent } from './result/result.component';
import { PreassessmentResultResolver } from '../shared/resolvers/preassessment-result.resolver';
import { PreAssessmentAttemptResolver } from '../shared/resolvers/pre-assessment-attempt.resolver';


const routes: Routes = [
  {
    path: '',
    component: PreAssessmentComponent
  },
  {
    path: 'attempt',
    component: AttemptComponent,
    resolve: { setProgresses: PreAssessmentAttemptResolver}
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'results',
    component: ResultComponent,
    resolve: {AssessmentAttemptWithQuestions: PreassessmentResultResolver} 
  }
];


@NgModule({
  declarations: [
    WelcomeComponent,
    PreAssessmentComponent,
    AttemptComponent,
    ResultComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    WelcomeComponent,
    PreAssessmentComponent,
    AttemptComponent
  ]
})

export class PreAssessmentModule { }
