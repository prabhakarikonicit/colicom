import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/authguards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'enrollment',
    loadChildren: () => import('./enrollment/enrollment.module').then(m => m.EnrollmentModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'pre-assessment',
    loadChildren: () => import('./pre-assessment/pre-assessment.module').then(m => m.PreAssessmentModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'practice',
    loadChildren: () => import('./practice/practice.module').then(m => m.PracticeModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'simulated-exam',
    loadChildren: () => import('./simulatedexam/simulatedexam.module').then(m => m.SimulatedExamModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'study',
    loadChildren: () => import('./study/study.module').then(m => m.StudyModule),
    canLoad: [AuthGuardService]
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule),
    canLoad: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
