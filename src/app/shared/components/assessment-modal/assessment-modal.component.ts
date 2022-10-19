import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-assessment-modal',
  templateUrl: './assessment-modal.component.html',
  styleUrls: ['./assessment-modal.component.scss']
})
export class AssessmentModalComponent implements OnInit {

  @Input() type: number = 0
  @Input() show: boolean = false
  @Output() onHideModal: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.onHideModal.emit(false);
  }

}
