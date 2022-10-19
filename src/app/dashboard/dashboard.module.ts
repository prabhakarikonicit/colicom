import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssessmentAttemptsResolverService } from '../shared/resolvers/assessment-attempts-resolver.service';
import { ProgressResolverService } from '../shared/resolvers/progress-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { assessmentAttempts: AssessmentAttemptsResolverService, progresses: ProgressResolverService }
  }
];
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    DashboardComponent
  ],
})
export class DashboardModule { }
