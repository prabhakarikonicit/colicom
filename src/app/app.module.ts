import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { PracticeModule } from './practice/practice.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { FormsModule } from '@angular/forms';
import { PreAssessmentModule } from './pre-assessment/pre-assessment.module';
import { TokenHttpInterceptor } from './shared/interceptor/http.interceptor';
import { StudyModule } from './study/study.module';
import { SimulatedExamModule } from './simulatedexam/simulatedexam.module';
import { ProfileModule } from './profile/profile.module';
import { DemoModule } from './demo/demo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    DashboardModule,
    PracticeModule,
    EnrollmentModule,
    SharedModule,
    FormsModule,
    StudyModule,
    BrowserAnimationsModule,
    PreAssessmentModule,
    SimulatedExamModule,
    DemoModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
