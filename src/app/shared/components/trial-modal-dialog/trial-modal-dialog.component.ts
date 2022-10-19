import { Component, Input, OnInit } from '@angular/core';
import { Enrollment, Exam } from '../../interfaces/interfaces';

@Component({
  selector: 'app-trial-modal-dialog',
  templateUrl: './trial-modal-dialog.component.html',
  styleUrls: ['./trial-modal-dialog.component.scss']
})
export class TrialModalDialogComponent implements OnInit {

  @Input() show: boolean = false;
  @Input() info: boolean = false;
  @Input() url: string = '';
  @Input() enrollment: Enrollment = {} as Enrollment;
  @Input() exam: Exam = {} as Exam;

  constructor() { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.show = false;
  }
}
