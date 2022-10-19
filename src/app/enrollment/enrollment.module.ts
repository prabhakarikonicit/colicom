import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EnrollmentComponent } from './enrollment.component';
import { EnrollmentResolverService } from '../shared/resolvers/enrollment-resolver.service';
const routes: Routes = [
  {
    path: '',
    component: EnrollmentComponent,
    resolve: { enrollments: EnrollmentResolverService }
  }
];
@NgModule({
  declarations: [
    EnrollmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    EnrollmentComponent
  ],
})
export class EnrollmentModule { }
