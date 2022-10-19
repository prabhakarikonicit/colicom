import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { ForgotComponent } from './forgot/forgot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SsoGuard } from '../shared/authguards/sso.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'update-password',
    component: PasswordComponent
  }
  ,{
    path: 'sso',
    component: DashboardComponent,
    canActivate: [SsoGuard]
  }

];
@NgModule({
  declarations: [
    LoginComponent,
    PasswordComponent,
    ForgotComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginComponent,
    PasswordComponent,
    ForgotComponent
  ],
  providers:[SsoGuard]
})
export class LoginModule { }
