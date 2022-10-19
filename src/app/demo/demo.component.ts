import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { ModuleService } from '../shared/services/module.service';
import { EnrollmentService } from '../shared/services/enrollment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeAttempt } from '../shared/interfaces/interfaces';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(private globalService: GlobalService, private moduleService: ModuleService, private enrollmentService: EnrollmentService, private router: Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    // show loading
    this.globalService.setLoaderMessage("Loading...");
    const selectedExamModule = this.activatedRoute.snapshot.data['SelectedExamModule'];

    this.globalService.selectedModule = selectedExamModule;

    this.moduleService.createAttempt(
        this.enrollmentService.getEnrollment().id,
        selectedExamModule.module.id,
        'practice',
        10 // limit to 10 for demos
    ).subscribe((collection: PracticeAttempt) => {
        this.moduleService.setAttempt(collection);
        this.router.navigate(['demo/attempt']);
    });
  }

}
