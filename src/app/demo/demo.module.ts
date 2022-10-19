import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoAttemptComponent } from './demo-attempt/demo-attempt.component';
import { DemoResultsComponent } from './demo-results/demo-results.component';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { DemoResolver } from '../shared/resolvers/demo.resolver';
import { SharedModule } from '../shared/shared.module';
import { DemoAttemptResolver } from '../shared/resolvers/demo-attempt.resolver';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    resolve: { SelectedExamModule: DemoResolver }
  },
  {
    path: 'results',
    component: DemoResultsComponent,
    // resolve: { DemoResultsResolverResponse: DemoAttemptResolver}
  },
  {
    path: 'attempt',
    component: DemoAttemptComponent,
    resolve: { DemoAttemptResolverResponse: DemoAttemptResolver}
  }
];



@NgModule({
  declarations: [
    DemoComponent,
    DemoAttemptComponent,
    DemoResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DemoModule { }
