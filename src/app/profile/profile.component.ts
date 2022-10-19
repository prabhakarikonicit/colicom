import { Component, OnInit } from '@angular/core';
import { Enrollment, Exam, User } from '../shared/interfaces/interfaces';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { GlobalService } from '../shared/services/global.service';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User = {} as User;
  exam: Exam = {} as Exam;
  enrollment: Enrollment = {} as Enrollment;

  constructor(private enrollmentService: EnrollmentService, private globalService: GlobalService, private loginService: LoginService) { }

  ngOnInit(): void {
    // global header
    this.globalService.selectedItem = 'profile';

    // remove loading
    this.globalService.hideLoader();

    this.user = this.loginService.getCurrentUser();
    this.exam = this.enrollmentService.getExam();
    this.enrollment = this.enrollmentService.getEnrollment();
  }

}
