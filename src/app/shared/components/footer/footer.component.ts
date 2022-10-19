import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private globalService: GlobalService) {

  }

  isDemo(): boolean {
    return this.globalService.isDemo();
  }

}
