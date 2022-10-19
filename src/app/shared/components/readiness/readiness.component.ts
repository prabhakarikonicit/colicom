import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-readiness',
  templateUrl: './readiness.component.html',
  styleUrls: ['./readiness.component.scss']
})
export class ReadinessComponent implements OnInit {

  @Input() overAllReadiness: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
