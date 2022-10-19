import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Enrollment, ExamModule, Progress } from '../interfaces/interfaces';
import { EnrollmentService } from '../services/enrollment.service';
import { ProgressService } from '../services/progress.service';
@Injectable({
  providedIn: 'root'
})
export class ProgressResolverService implements Resolve<any>  {

  constructor(private progressService: ProgressService, private enrollmentService: EnrollmentService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const enrollment: Enrollment = this.enrollmentService.getEnrollment();
    return this.progressService.query(enrollment.id)
      .pipe(map((progresses: Progress[]) => {
        // verify we have progress for all modules else run self healing process
        const examModules: ExamModule[] = this.enrollmentService.getExamModules();
        const missingProgressesByModuleIds: number[] = [];

        examModules.forEach((examModule: ExamModule) => {
          const progress: Progress[] = progresses.filter((progress: Progress) =>
            progress.moduleId === examModule.moduleId && progress.type === 'study'
          );

          if (!progress.length) {
            missingProgressesByModuleIds.push(examModule.moduleId);
          }
        });

        // if we have missing progress, call API to fix
        missingProgressesByModuleIds.forEach((missingProgressesByModuleId: Number) => {

          this.enrollmentService.createStudyProgress({
            enrollmentId: this.enrollmentService.getEnrollment().id,
            moduleId: missingProgressesByModuleId
          }).subscribe((collections: Progress) => {
            progresses.push(collections);
          });

          this.enrollmentService.createPracticeProgress({
            enrollmentId: this.enrollmentService.getEnrollment().id,
            moduleId: missingProgressesByModuleId
          }).subscribe((collections: Progress) => {
            progresses.push(collections);
          });
        })

        this.enrollmentService.setProgresses(progresses);
        return progresses;
      }));
  }
}
