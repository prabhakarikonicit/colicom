import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AssessmentAttempt, Enrollment, ExamModule } from '../shared/interfaces/interfaces';
import { AssessmentAttemptService } from '../shared/services/assessment-attempt.service';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { GlobalService } from '../shared/services/global.service';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {

  now: number = 0;
  MARKETING_SUPPORT_SITE: string = environment.MARKETING_SUPPORT_SITE;
  enrollments: Enrollment[] = [] as Enrollment[];

  constructor(private loginService: LoginService, private enrollmentService: EnrollmentService, private globalService: GlobalService, private router: Router, private assessmentAttemptService: AssessmentAttemptService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.globalService.hideLoader();
    this.now = new Date().getTime();
    this.globalService.enrollments = this.route.snapshot.data['enrollments'];
    this.enrollments = this.route.snapshot.data['enrollments'];
    this.setRedirection();
  }

  isExpired(enrollment: Enrollment): boolean {
    // any expiration time set?
    if (enrollment.expiration === null) {
      return false;
    } else {
      return (this.now > (enrollment.expiration * 1000));
    }
  }

  isDisabled(enrollment: Enrollment): boolean {
    return enrollment.status === 0;
  }

  canExpire(enrollment: Enrollment): boolean {
    return enrollment.expiration !== null;
  }

  isTrial(enrollment: Enrollment): boolean {
    return this.enrollmentService.isTrial(enrollment);
  }

  openEnrollment(enrollment: Enrollment): void {

    this.globalService.selectedEnrollment = enrollment; // for top nav
    this.globalService.selectedExam = enrollment.exam; // for top nav
    this.enrollmentService.setEnrollment(enrollment);
    this.enrollmentService.setOrganization(enrollment.organization);
    this.enrollmentService.setExam(enrollment.exam);

    // // do we need to update started?
    if (enrollment.started === null) {
      enrollment.started = Math.round(this.now / 1000);
    }

    if (this.isDisabled(enrollment)) {
      return;
    }

    // sent to buy extension if expired
    if (this.isExpired(enrollment)) {
      this.globalService.goToMarketingSiteExtensions();
      return;
    }

    // show loading
    this.globalService.setLoaderMessage();

    // load the modules
    this.enrollmentService.queryForExamWithModule(this.enrollmentService.getExam().id).subscribe((collection: ExamModule[]) => {
      // add modules to enrollment - order exam modules correct
      this.enrollmentService.setExamModules(collection);

      // if demo, go to demo controller
      if (this.globalService.isDemo()) {
        this.router.navigate(['demo']);
        return;
      }
      // check if we have already attempted the pre-assessment
      this.assessmentAttemptService.queryForEnrollmentPreAssessment(enrollment.id).subscribe((collection: AssessmentAttempt[]) => {
        // where to next?
        if (enrollment.showPreAssessment && collection.length === 0) {
          this.router.navigate(['/pre-assessment/welcome']);

        } else {
          this.router.navigate(['/dashboard']);
        }
      });
    })

  }

  setRedirection(): void {
    // move to dashboard if only one
    if (this.enrollments.length === 1) {
      this.openEnrollment(this.enrollments[0]);
    } else if (this.loginService.getExamId() !== null) {
      const enrollments: Enrollment[] = this.enrollments.filter((currentEnrollment: Enrollment) => currentEnrollment.examId === this.loginService.getExamId());
      if (enrollments.length) {
        this.openEnrollment(enrollments[0]);
      }
    }
  }

}
