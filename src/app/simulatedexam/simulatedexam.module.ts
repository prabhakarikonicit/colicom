import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimulatedexamComponent } from './simulatedexam.component';
import { SimulatedexamAttemptComponent } from './simulatedexam-attempt/simulatedexam-attempt.component';
import { SimulatedexamResultsComponent } from './simulatedexam-results/simulatedexam-results.component';
import { CanDeactivateGuard, SimulatedExamResolverService } from '../shared/resolvers/simulated-exam-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SimulatedexamComponent
  },
  {
    path: 'attempt',
    component: SimulatedexamAttemptComponent,
    resolve: { allQuestions: SimulatedExamResolverService },
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'results',
    component: SimulatedexamResultsComponent,
    resolve: { allQuestions: SimulatedExamResolverService }
  }
];

@NgModule({
  declarations: [
    SimulatedexamComponent,
    SimulatedexamAttemptComponent,
    SimulatedexamResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    SimulatedexamComponent,
    SimulatedexamAttemptComponent,
    SimulatedexamResultsComponent
  ]
})

export class SimulatedExamModule { }
